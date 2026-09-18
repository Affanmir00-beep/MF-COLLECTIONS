const mongoose = require('mongoose');
const dns = require('dns');

// Fix Windows SRV lookup timeout for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS not permitted
}

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mfdesigns', {
      maxPoolSize: 50, // Connection pooling for high concurrency & many req/sec
      minPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });
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
    console.error(`MongoDB connection error: ${error.message}`);
    if (retryCount < 5) {
      console.log(`Retrying MongoDB connection in 3s (attempt ${retryCount + 1}/5)...`);
      setTimeout(() => connectDB(retryCount + 1), 3000);
    }
  }
};

module.exports = connectDB;
