const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, 'decodelabs.db');
let db;

function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    db.exec('PRAGMA foreign_keys = ON');
    db.exec('PRAGMA journal_mode = WAL');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      role       TEXT NOT NULL DEFAULT 'intern',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS products (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      category   TEXT NOT NULL DEFAULT 'fullstack',
      price      REAL NOT NULL,
      stock      INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS orders (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity   INTEGER NOT NULL DEFAULT 1,
      total      REAL NOT NULL,
      status     TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (count === 0) {
    db.prepare('INSERT INTO users (name,email,role) VALUES (?,?,?)').run('Aisha Raza',   'aisha@decodelabs.tech', 'admin');
    db.prepare('INSERT INTO users (name,email,role) VALUES (?,?,?)').run('Hamza Sheikh', 'hamza@decodelabs.tech', 'intern');
    db.prepare('INSERT INTO users (name,email,role) VALUES (?,?,?)').run('Zara Malik',   'zara@decodelabs.tech',  'mentor');
    db.prepare('INSERT INTO products (name,category,price,stock) VALUES (?,?,?,?)').run('Responsive Layout Kit', 'frontend',  29.99, 100);
    db.prepare('INSERT INTO products (name,category,price,stock) VALUES (?,?,?,?)').run('Backend API Starter',   'backend',   49.99, 50);
    db.prepare('INSERT INTO products (name,category,price,stock) VALUES (?,?,?,?)').run('Full Stack Bundle',     'fullstack', 99.99, 25);
    console.log('✅ Database seeded with sample data');
  }
  console.log('✅ Database ready:', DB_PATH);
}

module.exports = { getDb };
