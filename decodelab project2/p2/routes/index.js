const { logger, success, error }                     = require('../middleware/index');
const { getUsers, getUserById, createUser }           = require('./users');
const { getProducts, getProductById, createProduct }  = require('./products');
const { submitContact }                               = require('./contact');

function matchPath(pattern, url) {
  const urlPath  = url.split('?')[0];
  const patParts = pattern.split('/');
  const urlParts = urlPath.split('/');
  if (patParts.length !== urlParts.length) return null;
  const params = {};
  for (let i = 0; i < patParts.length; i++) {
    if (patParts[i].startsWith(':')) params[patParts[i].slice(1)] = urlParts[i];
    else if (patParts[i] !== urlParts[i]) return null;
  }
  return params;
}

async function router(req, res) {
  const method = req.method;
  const path   = req.url.split('?')[0];
  logger(req);
  try {
    if (method === 'GET' && path === '/') {
      return success(res, {
        name: 'DecodeLabs Backend API', project: 'Project 2', batch: '2026', version: '1.0.0',
        endpoints: {
          root:     'GET /',
          status:   'GET /api/status',
          users:    'GET /api/users | GET /api/users/:id | POST /api/users',
          products: 'GET /api/products | GET /api/products/:id | POST /api/products',
          contact:  'POST /api/contact'
        }
      }, 'Welcome to the DecodeLabs API');
    }
    if (method === 'GET' && path === '/api/status') {
      return success(res, {
        status: 'healthy',
        uptime: Math.floor(process.uptime()) + 's',
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        nodeVersion: process.version
      }, 'API is running');
    }
    if (method === 'GET'  && path === '/api/users')    return await getUsers(req, res);
    if (method === 'POST' && path === '/api/users')    return await createUser(req, res);
    let p = matchPath('/api/users/:id', path);
    if (p && method === 'GET') return await getUserById(req, res, p.id);
    if (method === 'GET'  && path === '/api/products') return await getProducts(req, res);
    if (method === 'POST' && path === '/api/products') return await createProduct(req, res);
    if (method === 'GET'  && path.startsWith('/api/products/')) {
      p = matchPath('/api/products/:id', path);
      if (p) return await getProductById(req, res, p.id);
    }
    if (method === 'POST' && path === '/api/contact')  return await submitContact(req, res);
    error(res, 'Cannot ' + method + ' ' + path + ' — route not found.', 404);
  } catch (err) {
    console.error('Internal Error:', err);
    error(res, 'Internal server error.', 500);
  }
}

module.exports = { router };
