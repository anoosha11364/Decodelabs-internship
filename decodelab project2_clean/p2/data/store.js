let users = [
  { id: 1, name: 'Aisha Raza',   email: 'aisha@decodelabs.tech', role: 'admin',  createdAt: '2026-01-10T09:00:00Z' },
  { id: 2, name: 'Hamza Sheikh', email: 'hamza@decodelabs.tech', role: 'intern', createdAt: '2026-01-12T10:30:00Z' },
  { id: 3, name: 'Zara Malik',   email: 'zara@decodelabs.tech',  role: 'intern', createdAt: '2026-01-15T08:00:00Z' }
];

let products = [
  { id: 1, name: 'Responsive Layout Kit', category: 'frontend',  price: 29.99, stock: 100, createdAt: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Backend API Starter',   category: 'backend',   price: 49.99, stock: 50,  createdAt: '2026-01-02T00:00:00Z' },
  { id: 3, name: 'Full Stack Bundle',     category: 'fullstack', price: 99.99, stock: 25,  createdAt: '2026-01-03T00:00:00Z' }
];

let nextUserId = 4;
let nextProductId = 4;

module.exports = {
  getAllUsers:     ()     => [...users],
  getUserById:    (id)   => users.find(u => u.id === parseInt(id)),
  createUser:     (user) => { const n = { id: nextUserId++, ...user, createdAt: new Date().toISOString() }; users.push(n); return n; },
  getAllProducts:  ()     => [...products],
  getProductById: (id)   => products.find(p => p.id === parseInt(id)),
  createProduct:  (prod) => { const n = { id: nextProductId++, ...prod, createdAt: new Date().toISOString() }; products.push(n); return n; },
};
