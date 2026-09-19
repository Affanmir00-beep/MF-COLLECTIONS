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
  signupUser,
  loginUser,
  verifyOtp,
  googleLogin,
  refreshAuth,
  logoutUser,
  loginAdmin
} = require('../controllers/authController');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/google', googleLogin);
router.post('/refresh', refreshAuth);
router.post('/logout', logoutUser);

// Admin login has a separate route
router.post('/admin/login', authLimiter, validate(loginSchema), loginAdmin);

// Seed or ensure admin account is ready


module.exports = router;
