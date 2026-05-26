const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'red_cooperacion_ia_secret';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔐 asegurar estructura mínima
    if (!decoded.id) {
      return res.status(401).json({ error: 'Token inválido.' });
    }

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

module.exports = { protect };
