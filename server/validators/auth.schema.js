const { z } = require('zod');

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
  }).strict()
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }).strict()
});

const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otpCode: z.string().length(6, 'OTP must be exactly 6 characters')
  }).strict()
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyOtpSchema
};
