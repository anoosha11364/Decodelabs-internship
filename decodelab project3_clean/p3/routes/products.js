const { parseBody, success, error } = require('../middleware/index');
const { validateProduct }           = require('../middleware/validators');
const { getDb }                     = require('../db/database');

function getProducts(req, res) {
  try {
    const urlObj   = new URL(req.url, 'http://localhost');
    const category = urlObj.searchParams.get('category');
    let products;
    if (category) {
      products = getDb().prepare('SELECT * FROM products WHERE category = ? ORDER BY id').all(category);
    } else {
      products = getDb().prepare('SELECT * FROM products ORDER BY id').all();
    }
    success(res, { products, count: products.length }, 'Products retrieved successfully');
  } catch (err) {
    error(res, err.message, 500);
  }
}

function getProductById(req, res, id) {
  try {
    const product = getDb().prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return error(res, 'Product with id ' + id + ' not found.', 404);
    success(res, { product }, 'Product retrieved successfully');
  } catch (err) {
    error(res, err.message, 500);
  }
}

async function createProduct(req, res) {
  try {
    const body = await parseBody(req);
    const errs = validateProduct(body);
    if (errs.length) return error(res, 'Validation failed.', 400, errs);
    const result = getDb().prepare(
      'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)'
    ).run(
      body.name.trim(),
      body.category || 'fullstack',
      parseFloat(body.price.toFixed(2)),
      body.stock !== undefined ? Math.floor(body.stock) : 0
    );
    const newProduct = getDb().prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    success(res, { product: newProduct }, 'Product created successfully.', 201);
  } catch (err) {
    error(res, err.message, 500);
  }
}

async function updateProduct(req, res, id) {
  try {
    const existing = getDb().prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) return error(res, 'Product with id ' + id + ' not found.', 404);
    const body     = await parseBody(req);
    const name     = body.name     ? body.name.trim()             : existing.name;
    const category = body.category ? body.category                : existing.category;
    const price    = body.price    !== undefined ? body.price     : existing.price;
    const stock    = body.stock    !== undefined ? Math.floor(body.stock) : existing.stock;
    if (typeof price !== 'number' || price < 0)
      return error(res, 'Price must be a non-negative number.', 400);
    if (!['frontend','backend','fullstack','design','devops'].includes(category))
      return error(res, 'Invalid category.', 400);
    getDb().prepare('UPDATE products SET name=?, category=?, price=?, stock=? WHERE id=?')
           .run(name, category, price, stock, id);
    const updated = getDb().prepare('SELECT * FROM products WHERE id = ?').get(id);
    success(res, { product: updated }, 'Product updated successfully.');
  } catch (err) {
    error(res, err.message, 500);
  }
}

function deleteProduct(req, res, id) {
  try {
    const existing = getDb().prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) return error(res, 'Product with id ' + id + ' not found.', 404);
    getDb().prepare('DELETE FROM products WHERE id = ?').run(id);
    success(res, { deleted_id: parseInt(id) }, 'Product deleted successfully.');
  } catch (err) {
    error(res, err.message, 500);
  }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
