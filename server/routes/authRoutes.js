const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiters');
const {
  requestOtpSchema,
  loginSchema,
  verifyOtpSchema
} = require('../validators/auth.schema');

const {
  loginUser,
  requestOtp,
  verifyOtp,
  refreshAuth,
  logoutUser,
  loginAdmin,
  seedAdminController,
} = require('../controllers/authController');

router.post('/login', authLimiter, validate(loginSchema), loginUser);
router.post('/request-otp', authLimiter, validate(requestOtpSchema), requestOtp);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), verifyOtp);
router.post('/refresh', refreshAuth);
router.post('/logout', logoutUser);

// Admin login has a separate route
router.post('/admin/login', authLimiter, validate(loginSchema), loginAdmin);

// Seed or ensure admin account is ready
router.get('/seed-admin', seedAdminController);

module.exports = router;
