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
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, code, payload) {
  res.writeHead(code);
  res.end(JSON.stringify(payload, null, 2));
}

function success(res, data, message, status) {
  sendJSON(res, status || 200, {
    success: true, status: status || 200,
    message: message || 'OK', data,
    timestamp: new Date().toISOString()
  });
}

function error(res, message, status, errors) {
  const body = { success: false, status: status || 400, message, timestamp: new Date().toISOString() };
  if (errors) body.errors = errors;
  sendJSON(res, status || 400, body);
}

module.exports = { logger, parseBody, success, error };
