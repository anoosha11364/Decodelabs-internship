const { parseBody, success, error } = require('../middleware/index');
const { validateNewProduct }        = require('../middleware/validators');
const store                         = require('../data/store');

async function getProducts(req, res) {
  const urlObj   = new URL(req.url, 'http://localhost');
  const category = urlObj.searchParams.get('category');
  let products   = store.getAllProducts();
  if (category) products = products.filter(p => p.category === category.toLowerCase());
  success(res, { products, count: products.length }, 'Products retrieved successfully');
}

async function getProductById(req, res, id) {
  const product = store.getProductById(id);
  if (!product) return error(res, 'Product with id ' + id + ' not found.', 404);
  success(res, { product }, 'Product retrieved successfully');
}

async function createProduct(req, res) {
  let body;
  try { body = await parseBody(req); }
  catch (e) { return error(res, 'Invalid JSON body.', 400); }
  const errors = validateNewProduct(body);
  if (errors.length > 0) return error(res, 'Validation failed.', 400, errors);
  const newProduct = store.createProduct({
    name:     body.name.trim(),
    category: body.category || 'fullstack',
    price:    parseFloat(body.price.toFixed(2)),
    stock:    body.stock !== undefined ? Math.floor(body.stock) : 0,
  });
  success(res, { product: newProduct }, 'Product created successfully.', 201);
}

module.exports = { getProducts, getProductById, createProduct };
