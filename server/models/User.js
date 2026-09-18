const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, minlength: 6 }, // Password is optional (for Google Auth)
  googleId: { type: String },
  role: { type: String, enum: ['customer', 'admin', 'superadmin'], default: 'customer' },
  // For admin role: restrict which sections they can access. Empty = full access.
  permissions: { type: [String], enum: ['products', 'orders', 'categories', 'storefront', 'dashboard'], default: [] },

  phone: { type: String },
  addresses: [{
    fullName: String, 
    phone: String, 
    addressLine: String, 
    city: String, 
    province: String, 
    isDefault: Boolean
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  otpCode: { type: String },
  otpExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false },
  refreshToken: { type: String },
  refreshTokenJti: { type: String } // For fast revocation of refresh tokens
}, {
  timestamps: true
});

// Pre-save middleware for password hashing
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to match entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
