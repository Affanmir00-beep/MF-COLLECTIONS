const rateLimit = require('express-rate-limit');

// Global rate limiter: 800 requests per 15 minutes per IP for general browsing
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 800, 
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth routes (login, register, reset password): 25 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Order & checkout limiter: 30 checkout submissions per 15 minutes
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many checkout attempts. Please wait a moment before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Search & Heavy Ops limiter: 100 requests per 15 minutes
const heavyOpsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many heavy operations requested, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  globalLimiter,
  authLimiter,
  orderLimiter,
  heavyOpsLimiter
};
