function logger(req) {
  console.log('[' + new Date().toISOString() + ']  ' + req.method + '  ' + req.url);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const ct = req.headers['content-type'] || '';
    if (!ct.includes('application/json')) return resolve({});
    let raw = '';
    req.on('data', chunk => { raw += chunk.toString(); });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, payload) {
  res.writeHead(statusCode);
  res.end(JSON.stringify(payload, null, 2));
}

function success(res, data, message, status) {
  message = message || 'OK';
  status  = status  || 200;
  sendJSON(res, status, { success: true, status, message, data, timestamp: new Date().toISOString() });
}

function error(res, message, status, errors) {
  status = status || 400;
  const body = { success: false, status, message, timestamp: new Date().toISOString() };
  if (errors) body.errors = errors;
  sendJSON(res, status, body);
}

module.exports = { logger, parseBody, success, error };
