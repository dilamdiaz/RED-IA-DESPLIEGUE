const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'red_cooperacion_ia_secret';
const JWT_EXPIRES_IN = '2h';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = generateToken;
