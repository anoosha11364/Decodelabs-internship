const { parseBody, success, error } = require('../middleware/index');
const { validateOrder }             = require('../middleware/validators');
const { getDb }                     = require('../db/database');

const ORDER_SELECT = `
  SELECT o.id, o.quantity, o.total, o.status, o.created_at,
         u.id as user_id, u.name as user_name, u.email as user_email,
         p.id as product_id, p.name as product_name, p.price as product_price
  FROM orders o
  JOIN users    u ON o.user_id    = u.id
  JOIN products p ON o.product_id = p.id
`;

function formatOrder(row) {
  return {
    id: row.id, quantity: row.quantity, total: row.total,
    status: row.status, created_at: row.created_at,
    user:    { id: row.user_id,    name: row.user_name,    email: row.user_email },
    product: { id: row.product_id, name: row.product_name, price: row.product_price }
  };
}

function getOrders(req, res) {
  try {
    const rows   = getDb().prepare(ORDER_SELECT + ' ORDER BY o.id').all();
    const orders = rows.map(formatOrder);
    success(res, { orders, count: orders.length }, 'Orders retrieved successfully');
  } catch (err) {
    error(res, err.message, 500);
  }
}

function getOrderById(req, res, id) {
  try {
    const row = getDb().prepare(ORDER_SELECT + ' WHERE o.id = ?').get(id);
    if (!row) return error(res, 'Order with id ' + id + ' not found.', 404);
    success(res, { order: formatOrder(row) }, 'Order retrieved successfully');
  } catch (err) {
    error(res, err.message, 500);
  }
}

async function createOrder(req, res) {
  try {
    const body = await parseBody(req);
    const errs = validateOrder(body);
    if (errs.length) return error(res, 'Validation failed.', 400, errs);
    const user    = getDb().prepare('SELECT * FROM users    WHERE id = ?').get(body.user_id);
    const product = getDb().prepare('SELECT * FROM products WHERE id = ?').get(body.product_id);
    if (!user)    return error(res, 'User with id '    + body.user_id    + ' not found.', 404);
    if (!product) return error(res, 'Product with id ' + body.product_id + ' not found.', 404);
    const quantity = body.quantity || 1;
    const total    = parseFloat((product.price * quantity).toFixed(2));
    const result = getDb().prepare(
      'INSERT INTO orders (user_id, product_id, quantity, total) VALUES (?,?,?,?)'
    ).run(body.user_id, body.product_id, quantity, total);
    const row = getDb().prepare(ORDER_SELECT + ' WHERE o.id = ?').get(result.lastInsertRowid);
    success(res, { order: formatOrder(row) }, 'Order created successfully.', 201);
  } catch (err) {
    error(res, err.message, 500);
  }
}

async function updateOrder(req, res, id) {
  try {
    const existing = getDb().prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!existing) return error(res, 'Order with id ' + id + ' not found.', 404);
    const body   = await parseBody(req);
    const status = body.status || existing.status;
    if (!['pending','confirmed','cancelled'].includes(status))
      return error(res, 'Status must be: pending, confirmed, or cancelled.', 400);
    getDb().prepare('UPDATE orders SET status=? WHERE id=?').run(status, id);
    const row = getDb().prepare(ORDER_SELECT + ' WHERE o.id = ?').get(id);
    success(res, { order: formatOrder(row) }, 'Order updated successfully.');
  } catch (err) {
    error(res, err.message, 500);
  }
}

function deleteOrder(req, res, id) {
  try {
    const existing = getDb().prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!existing) return error(res, 'Order with id ' + id + ' not found.', 404);
    getDb().prepare('DELETE FROM orders WHERE id = ?').run(id);
    success(res, { deleted_id: parseInt(id) }, 'Order deleted successfully.');
  } catch (err) {
    error(res, err.message, 500);
  }
}

module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };
