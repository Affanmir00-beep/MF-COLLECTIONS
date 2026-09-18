const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

// We will use the client ID from env if provided
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

const sendOtpEmail = async (email, otpCode) => {
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; text-align: center;">
      <h2 style="color: #111;">MF Designs Security</h2>
      <p style="color: #444; font-size: 16px;">Your One-Time Password (OTP) for Two-Factor Authentication is:</p>
      <div style="background-color: #f4f4f4; padding: 20px; font-size: 32px; letter-spacing: 5px; font-weight: bold; margin: 20px 0; border-radius: 8px;">
        ${otpCode}
      </div>
      <p style="color: #777; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Your MF Designs Verification Code',
    html: emailHtml,
  });
};

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  let user = await User.findOne({ email });
  if (user) {
    res.status(400);
    throw new Error('User already exists');
  }

  user = await User.create({
    name,
    email,
    password,
    isVerified: false
  });

  // Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpCode = otpCode;
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOtpEmail(email, otpCode);

  res.status(201).json({ message: 'Signup successful. Please verify OTP sent to email.', email });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // If user is admin or superadmin, bypass OTP and log them in instantly
    if (user.role === 'admin' || user.role === 'superadmin') {
      await generateTokens(res, user);
      return res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, requiresOtp: false });
    }

    // Regular customers - Trigger 2FA (OTP)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otpCode;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otpCode);
    
    res.json({ message: 'Password correct. OTP sent.', requiresOtp: true, email });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

const verifyOtp = async (req, res) => {
  const { email, otpCode } = req.body;
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
  await user.save();

  await generateTokens(res, user);
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
};

const googleLogin = async (req, res) => {
  const { token } = req.body;
  
  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(500);
    throw new Error('Google Auth is not configured on the server.');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  
  const payload = ticket.getPayload();
  const { email, name, sub: googleId } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    // Create user via Google
    user = await User.create({
      name,
      email,
      googleId,
      isVerified: true // Google already verified them
    });
  } else if (!user.googleId) {
    // Link existing account with Google
    user.googleId = googleId;
    user.isVerified = true;
    await user.save();
  }

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
        role: 'admin',
        isVerified: true
      });
    } else {
      admin.password = 'password123';
      admin.role = 'admin';
      admin.isVerified = true;
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
  signupUser,
  loginUser,
  verifyOtp,
  googleLogin,
  refreshAuth,
  logoutUser,
  loginAdmin,
  seedAdminController
};
