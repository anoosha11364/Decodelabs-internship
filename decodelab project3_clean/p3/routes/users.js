const { parseBody, success, error } = require('../middleware/index');
const { validateUser }              = require('../middleware/validators');
const { getDb }                     = require('../db/database');

function getUsers(req, res) {
  try {
    const users = getDb().prepare('SELECT * FROM users ORDER BY id').all();
    success(res, { users, count: users.length }, 'Users retrieved successfully');
  } catch (err) {
    error(res, err.message, 500);
  }
}

function getUserById(req, res, id) {
  try {
    const user = getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) return error(res, 'User with id ' + id + ' not found.', 404);
    success(res, { user }, 'User retrieved successfully');
  } catch (err) {
    error(res, err.message, 500);
  }
}

async function createUser(req, res) {
  try {
    const body = await parseBody(req);
    const errs = validateUser(body);
    if (errs.length) return error(res, 'Validation failed.', 400, errs);
    const existing = getDb().prepare('SELECT id FROM users WHERE email = ?').get(body.email.toLowerCase().trim());
    if (existing) return error(res, 'Email already exists.', 409);
    const result = getDb().prepare(
      'INSERT INTO users (name, email, role) VALUES (?, ?, ?)'
    ).run(body.name.trim(), body.email.toLowerCase().trim(), body.role || 'intern');
    const newUser = getDb().prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    success(res, { user: newUser }, 'User created successfully.', 201);
  } catch (err) {
    error(res, err.message, 500);
  }
}

async function updateUser(req, res, id) {
  try {
    const existing = getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existing) return error(res, 'User with id ' + id + ' not found.', 404);
    const body  = await parseBody(req);
    const name  = body.name  ? body.name.trim()                : existing.name;
    const email = body.email ? body.email.toLowerCase().trim() : existing.email;
    const role  = body.role  ? body.role                       : existing.role;
    if (email !== existing.email) {
      const dup = getDb().prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
      if (dup) return error(res, 'Email already in use by another user.', 409);
    }
    if (role && !['admin','intern','mentor'].includes(role))
      return error(res, 'Role must be: admin, intern, or mentor.', 400);
    getDb().prepare('UPDATE users SET name=?, email=?, role=? WHERE id=?').run(name, email, role, id);
    const updated = getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
    success(res, { user: updated }, 'User updated successfully.');
  } catch (err) {
    error(res, err.message, 500);
  }
}

function deleteUser(req, res, id) {
  try {
    const existing = getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existing) return error(res, 'User with id ' + id + ' not found.', 404);
    getDb().prepare('DELETE FROM users WHERE id = ?').run(id);
    success(res, { deleted_id: parseInt(id) }, 'User deleted successfully.');
  } catch (err) {
    error(res, err.message, 500);
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
