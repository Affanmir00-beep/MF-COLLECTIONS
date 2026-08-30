const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const requireSecret = () => {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
  }
  return process.env.JWT_SECRET || 'fallback_secret';
};

const generateTokens = async (res, user) => {
  const secret = requireSecret();
  
  const accessToken = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '15m' });
  const jti = crypto.randomUUID();
  const refreshToken = jwt.sign({ userId: user._id, jti }, secret, { expiresIn: '7d' });

  user.refreshToken = refreshToken;
  user.refreshTokenJti = jti;
  await user.save();

  const isProd = process.env.NODE_ENV === 'production';
  const cookieOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  };

  res.cookie('accessToken', accessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Optionally trigger OTP here instead of logging in directly if you want strict 2FA
    await generateTokens(res, user);
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  const user = await User.create({
    name, email, password, otpCode, otpExpiresAt
  });

  if (user) {
    // TODO: Actually send the OTP via notification.service.js
    console.log(`OTP for ${email} is ${otpCode}`);
    res.status(201).json({ message: 'User registered. Please verify OTP sent to your email.' });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

const verifyOtp = async (req, res) => {
  const { email, otpCode } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('User already verified');
  }

  if (user.otpCode !== otpCode || user.otpExpiresAt < new Date()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  await generateTokens(res, user);
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
};

const refreshAuth = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(401);
    throw new Error('Not authorized, no refresh token');
  }
  
  try {
    const decoded = jwt.verify(refreshToken, requireSecret());
    const user = await User.findById(decoded.userId);
    
    // Check JTI for revocation/rotation
    if (!user || user.refreshTokenJti !== decoded.jti) {
      res.status(401);
      throw new Error('Refresh token revoked or invalid');
    }

    await generateTokens(res, user);
    res.json({ message: 'Token refreshed' });
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
};

const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, requireSecret());
      const user = await User.findById(decoded.userId);
      if (user) {
        user.refreshToken = undefined;
        user.refreshTokenJti = undefined;
        await user.save();
      }
    } catch(e) {}
  }

  res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0) });
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.role === 'admin' || user.role === 'superadmin') {
      await generateTokens(res, user);
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(403);
      throw new Error('Access denied. Not an admin.');
    }
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

module.exports = {
  loginUser,
  registerUser,
  verifyOtp,
  refreshAuth,
  logoutUser,
  loginAdmin
};
