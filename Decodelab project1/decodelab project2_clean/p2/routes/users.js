const { parseBody, success, error } = require('../middleware/index');
const { validateNewUser }           = require('../middleware/validators');
const store                         = require('../data/store');

async function getUsers(req, res) {
  const users = store.getAllUsers();
  success(res, { users, count: users.length }, 'Users retrieved successfully');
}

async function getUserById(req, res, id) {
  const user = store.getUserById(id);
  if (!user) return error(res, 'User with id ' + id + ' not found.', 404);
  success(res, { user }, 'User retrieved successfully');
}

async function createUser(req, res) {
  let body;
  try { body = await parseBody(req); }
  catch (e) { return error(res, 'Invalid JSON body.', 400); }
  const errors = validateNewUser(body);
  if (errors.length > 0) return error(res, 'Validation failed.', 400, errors);
  const duplicate = store.getAllUsers().find(u => u.email.toLowerCase() === body.email.toLowerCase());
  if (duplicate) return error(res, 'A user with this email already exists.', 409);
  const newUser = store.createUser({
    name:  body.name.trim(),
    email: body.email.toLowerCase().trim(),
    role:  body.role || 'intern',
  });
  success(res, { user: newUser }, 'User created successfully.', 201);
}

module.exports = { getUsers, getUserById, createUser };
