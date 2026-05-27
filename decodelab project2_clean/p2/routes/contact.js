const { parseBody, success, error } = require('../middleware/index');
const { validateContact }           = require('../middleware/validators');

async function submitContact(req, res) {
  let body;
  try { body = await parseBody(req); }
  catch (e) { return error(res, 'Invalid JSON body.', 400); }
  const errors = validateContact(body);
  if (errors.length > 0) return error(res, 'Validation failed.', 400, errors);
  const ticket = {
    ticketId:  'DL-' + Date.now(),
    name:      body.name.trim(),
    email:     body.email.trim(),
    message:   body.message.trim(),
    status:    'received',
    createdAt: new Date().toISOString()
  };
  success(res, { ticket }, 'Message received! We will get back to you shortly.', 201);
}

module.exports = { submitContact };
