function validateUser(body) {
  const e = [];
  if (!body.name || body.name.trim().length < 2)
    e.push({ field: 'name', message: 'Name required, min 2 chars.' });
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    e.push({ field: 'email', message: 'Valid email required.' });
  if (body.role && !['admin','intern','mentor'].includes(body.role))
    e.push({ field: 'role', message: 'Role must be: admin, intern, or mentor.' });
  return e;
}

function validateProduct(body) {
  const e = [];
  if (!body.name || body.name.trim().length < 2)
    e.push({ field: 'name', message: 'Name required, min 2 chars.' });
  if (body.price === undefined || typeof body.price !== 'number' || body.price < 0)
    e.push({ field: 'price', message: 'Price must be a non-negative number.' });
  if (body.category && !['frontend','backend','fullstack','design','devops'].includes(body.category))
    e.push({ field: 'category', message: 'Invalid category.' });
  return e;
}

function validateOrder(body) {
  const e = [];
  if (!body.user_id    || typeof body.user_id    !== 'number') e.push({ field: 'user_id',    message: 'user_id (number) required.' });
  if (!body.product_id || typeof body.product_id !== 'number') e.push({ field: 'product_id', message: 'product_id (number) required.' });
  if (body.quantity !== undefined && (typeof body.quantity !== 'number' || body.quantity < 1))
    e.push({ field: 'quantity', message: 'Quantity must be >= 1.' });
  return e;
}

module.exports = { validateUser, validateProduct, validateOrder };
