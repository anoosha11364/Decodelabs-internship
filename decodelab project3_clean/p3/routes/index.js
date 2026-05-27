const { logger, success, error }                                                   = require('../middleware/index');
const { getUsers, getUserById, createUser, updateUser, deleteUser }                = require('./users');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./products');
const { getOrders, getOrderById, createOrder, updateOrder, deleteOrder }           = require('./orders');

function matchPath(pattern, url) {
  const urlPath = url.split('?')[0];
  const pp = pattern.split('/');
  const up = urlPath.split('/');
  if (pp.length !== up.length) return null;
  const params = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) params[pp[i].slice(1)] = up[i];
    else if (pp[i] !== up[i]) return null;
  }
  return params;
}

async function router(req, res) {
  const { method } = req;
  const path = req.url.split('?')[0];
  logger(req);

  try {
    if (method === 'GET' && path === '/') {
      return success(res, {
        name: 'DecodeLabs Backend API', project: 'Project 3 — Database Integration',
        batch: '2026', version: '1.0.0', database: 'SQLite (decodelabs.db)',
        endpoints: {
          users:    'GET|POST /api/users  |  GET|PUT|DELETE /api/users/:id',
          products: 'GET|POST /api/products  |  GET|PUT|DELETE /api/products/:id',
          orders:   'GET|POST /api/orders  |  GET|PUT|DELETE /api/orders/:id',
          status:   'GET /api/status'
        }
      }, 'Welcome to DecodeLabs API — Project 3');
    }

    if (method === 'GET' && path === '/api/status') {
      return success(res, {
        status: 'healthy', uptime: Math.floor(process.uptime()) + 's',
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        database: 'SQLite connected', nodeVersion: process.version
      }, 'API is running');
    }

    let p;

    if (method === 'GET'    && path === '/api/users')    return getUsers(req, res);
    if (method === 'POST'   && path === '/api/users')    return await createUser(req, res);
    p = matchPath('/api/users/:id', path);
    if (p) {
      if (method === 'GET')    return getUserById(req, res, p.id);
      if (method === 'PUT')    return await updateUser(req, res, p.id);
      if (method === 'DELETE') return deleteUser(req, res, p.id);
    }

    if (method === 'GET'    && path === '/api/products') return getProducts(req, res);
    if (method === 'POST'   && path === '/api/products') return await createProduct(req, res);
    p = matchPath('/api/products/:id', path);
    if (p) {
      if (method === 'GET')    return getProductById(req, res, p.id);
      if (method === 'PUT')    return await updateProduct(req, res, p.id);
      if (method === 'DELETE') return deleteProduct(req, res, p.id);
    }

    if (method === 'GET'    && path === '/api/orders')   return getOrders(req, res);
    if (method === 'POST'   && path === '/api/orders')   return await createOrder(req, res);
    p = matchPath('/api/orders/:id', path);
    if (p) {
      if (method === 'GET')    return getOrderById(req, res, p.id);
      if (method === 'PUT')    return await updateOrder(req, res, p.id);
      if (method === 'DELETE') return deleteOrder(req, res, p.id);
    }

    error(res, 'Cannot ' + method + ' ' + path + ' — route not found.', 404);

  } catch (err) {
    console.error('Internal Error:', err);
    error(res, 'Internal server error.', 500);
  }
}

module.exports = { router };
