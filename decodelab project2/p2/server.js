const http = require('http');
const { router } = require('./routes/index');

const PORT = 3000;
const HOST = 'localhost';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  router(req, res);
});

server.listen(PORT, HOST, () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   DecodeLabs — Project 2: Backend API  ║');
  console.log('╠════════════════════════════════════════╣');
  console.log('║  http://localhost:3000                  ║');
  console.log('╠════════════════════════════════════════╣');
  console.log('║  GET    /api/users                     ║');
  console.log('║  POST   /api/users                     ║');
  console.log('║  GET    /api/products                  ║');
  console.log('║  POST   /api/products                  ║');
  console.log('║  POST   /api/contact                   ║');
  console.log('╚════════════════════════════════════════╝\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') console.error('Port 3000 already in use.');
  else console.error('Server error:', err.message);
  process.exit(1);
});
