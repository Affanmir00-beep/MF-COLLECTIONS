require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin2 = async () => {
  const email = process.env.ADMIN2_EMAIL;
  const password = process.env.ADMIN2_PASSWORD;
  const name = process.env.ADMIN2_NAME || 'Upload Admin';

  if (!email || !password) {
    console.error('Missing ADMIN2_EMAIL or ADMIN2_PASSWORD in .env');
    process.exit(1);
  }

  try {
    await connectDB();
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin2 user already exists.');
      process.exit(0);
    }

    await User.create({ name, email, password, role: 'admin' });

    console.log(`Admin2 user created. Email: ${email}`);
    console.log('Panel URL: /admin2');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin2 user:', error);
    process.exit(1);
  }
};

seedAdmin2();

