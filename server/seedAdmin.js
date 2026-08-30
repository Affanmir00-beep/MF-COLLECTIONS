require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@mfdesigns.com' });
    
    if (adminExists) {
      console.log('Admin user already exists.');
      process.exit();
    }

    await User.create({
      name: 'MF Designs Admin',
      email: 'admin@mfdesigns.com',
      password: 'password123',
      role: 'admin'
    });

    console.log('Admin user seeded successfully. Email: admin@mfdesigns.com | Password: password123');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
