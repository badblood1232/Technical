const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Missing or invalid Authorization header');
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    console.log('Decoded user:', user);
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
