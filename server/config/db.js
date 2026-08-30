const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mfdesigns');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed default admin if none exists
    const User = require('../models/User');
    const adminExists = await User.findOne({ role: { $in: ['admin', 'superadmin'] } });
    if (!adminExists) {
      await User.create({
        name: 'MF Designs Admin',
        email: 'admin@mfdesigns.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('✅ Default Admin created: admin@mfdesigns.com / password123');
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
