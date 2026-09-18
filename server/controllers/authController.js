const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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

const requestOtp = async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  const isNewUser = !user;

  if (!user) {
    user = await User.create({
      name: 'Guest User',
      email,
      isVerified: false
    });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  user.otpCode = otpCode;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  // Send the OTP via email
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; text-align: center;">
      <h2 style="color: #111;">MF Designs Login</h2>
      <p style="color: #444; font-size: 16px;">Your One-Time Password (OTP) is:</p>
      <div style="background-color: #f4f4f4; padding: 20px; font-size: 32px; letter-spacing: 5px; font-weight: bold; margin: 20px 0; border-radius: 8px;">
        ${otpCode}
      </div>
      <p style="color: #777; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Your MF Designs Login Code',
    html: emailHtml,
  });
  
  res.status(200).json({ 
    message: 'OTP sent to your email.',
    isNewUser 
  });
};

const verifyOtp = async (req, res) => {
  const { email, otpCode, name } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.otpCode !== otpCode || user.otpExpiresAt < new Date()) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  
  if (name && user.name === 'Guest User') {
    user.name = name;
  }

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

const seedAdminController = async (req, res) => {
  try {
    let admin = await User.findOne({ email: 'admin@mfdesigns.com' });
    if (!admin) {
      admin = await User.create({
        name: 'MF Designs Admin',
        email: 'admin@mfdesigns.com',
        password: 'password123',
        role: 'admin'
      });
    } else {
      admin.password = 'password123';
      admin.role = 'admin';
      await admin.save();
    }
    res.json({
      success: true,
      message: 'Admin account is ready to login!',
      email: 'admin@mfdesigns.com',
      password: 'password123',
      role: 'admin'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  loginUser,
  requestOtp,
  verifyOtp,
  refreshAuth,
  logoutUser,
  loginAdmin,
  seedAdminController
};
