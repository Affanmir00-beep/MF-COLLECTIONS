require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  try {
    await connectDB();
    
    const adminExists = await User.findOne({ email });
    
    if (adminExists) {
      console.log('Admin user already exists.');
      process.exit();
    }

    await User.create({ name, email, password, role: 'admin' });

    console.log(`Admin user seeded. Email: ${email}`);
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

