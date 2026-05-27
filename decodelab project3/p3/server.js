const http = require('http');
const { router } = require('./routes/index');

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  router(req, res);
});

server.listen(PORT, 'localhost', () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  DecodeLabs — Project 3: Database API    ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  http://localhost:3000                    ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  GET|POST        /api/users              ║');
  console.log('║  GET|PUT|DELETE  /api/users/:id          ║');
  console.log('║  GET|POST        /api/products           ║');
  console.log('║  GET|PUT|DELETE  /api/products/:id       ║');
  console.log('║  GET|POST        /api/orders             ║');
  console.log('║  GET|PUT|DELETE  /api/orders/:id         ║');
  console.log('╚══════════════════════════════════════════╝\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') console.error('❌ Port 3000 in use. Close other process first.');
  else console.error('❌ Server error:', err.message);
  process.exit(1);
});
