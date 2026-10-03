const { prisma } = require('../database/prisma');

const authRequired = async (req, res, next) => {
  if (req.user) return next();

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  try {
    const { verifyToken } = require('../utils/crypto');
    const payload = verifyToken(token);
    if (!payload) throw new Error('Invalid token');

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new Error('Unknown user');

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Authentication failed.' });
  }
};

const requireRole = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Authentication required.' });
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'You do not have permission to perform this action.' });
  }
  next();
};

const optionalAuth = (req, res, next) => {
  if (req.user) return next();
  next();
};

module.exports = { authRequired, requireRole, optionalAuth };
