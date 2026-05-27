function validateNewUser(body) {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2)
    errors.push({ field: 'name', message: 'Name is required and must be at least 2 characters.' });
  if (!body.email || typeof body.email !== 'string')
    errors.push({ field: 'email', message: 'Email is required.' });
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.push({ field: 'email', message: 'Email format is invalid.' });
  const allowedRoles = ['admin', 'intern', 'mentor'];
  if (body.role && !allowedRoles.includes(body.role))
    errors.push({ field: 'role', message: 'Role must be one of: admin, intern, mentor.' });
  return errors;
}

function validateNewProduct(body) {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2)
    errors.push({ field: 'name', message: 'Product name is required (min 2 chars).' });
  if (body.price === undefined || body.price === null)
    errors.push({ field: 'price', message: 'Price is required.' });
  else if (typeof body.price !== 'number' || body.price < 0)
    errors.push({ field: 'price', message: 'Price must be a non-negative number.' });
  const allowedCats = ['frontend', 'backend', 'fullstack', 'design', 'devops'];
  if (body.category && !allowedCats.includes(body.category))
    errors.push({ field: 'category', message: 'Category must be one of: frontend, backend, fullstack, design, devops.' });
  return errors;
}

function validateContact(body) {
  const errors = [];
  if (!body.name || body.name.trim().length < 2)
    errors.push({ field: 'name', message: 'Name is required (min 2 chars).' });
  if (!body.email)
    errors.push({ field: 'email', message: 'Email is required.' });
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.push({ field: 'email', message: 'Email format is invalid.' });
  if (!body.message || body.message.trim().length < 10)
    errors.push({ field: 'message', message: 'Message is required (min 10 chars).' });
  return errors;
}

module.exports = { validateNewUser, validateNewProduct, validateContact };
