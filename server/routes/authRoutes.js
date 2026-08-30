const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiters');
const {
  registerSchema,
  loginSchema,
  verifyOtpSchema
} = require('../validators/auth.schema');

const {
  loginUser,
  registerUser,
  verifyOtp,
  refreshAuth,
  logoutUser,
  loginAdmin,
} = require('../controllers/authController');

router.post('/login', authLimiter, validate(loginSchema), loginUser);
router.post('/register', authLimiter, validate(registerSchema), registerUser);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), verifyOtp);
router.post('/refresh', refreshAuth);
router.post('/logout', logoutUser);

// Admin login has a separate route, you can apply stricter limiters if you want
router.post('/admin/login', authLimiter, validate(loginSchema), loginAdmin);

module.exports = router;
