require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin2 = async () => {
  try {
    await connectDB();
    
    const existing = await User.findOne({ email: 'upload@mfdesigns.com' });
    if (existing) {
      console.log('Admin2 user already exists.');
      console.log('Email: upload@mfdesigns.com | Password: Upload@MF2024');
      process.exit(0);
    }

    await User.create({
      name: 'MF Upload Admin',
      email: 'upload@mfdesigns.com',
      password: 'Upload@MF2024',
      role: 'admin'
    });

    console.log('Admin2 user created successfully.');
    console.log('Email: upload@mfdesigns.com');
    console.log('Password: Upload@MF2024');
    console.log('Panel URL: /admin2');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin2 user:', error);
    process.exit(1);
  }
};

seedAdmin2();
