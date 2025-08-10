// middleware/authOptional.js
const jwt = require('jsonwebtoken');

module.exports = function authOptional(req, res, next) {
  const hdr = req.headers.authorization || '';
  const hasBearer = hdr.startsWith('Bearer ');
  if (!hasBearer) return next();                 // guest OK

  try {
    const token = hdr.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
