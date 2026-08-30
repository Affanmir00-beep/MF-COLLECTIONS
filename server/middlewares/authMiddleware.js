const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireSecret = () => {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
  }
  return process.env.JWT_SECRET || 'fallback_secret';
};

const protect = async (req, res, next) => {
  // CSRF Defense for state-changing requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
      // return res.status(403).json({ message: 'CSRF token missing or invalid' });
    }
  }

  let token = req.cookies.accessToken || req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, requireSecret());
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a superadmin' });
  }
};

module.exports = { protect, adminOnly, superAdminOnly };
