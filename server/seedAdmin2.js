require('dotenv').config();
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin2 = async () => {
  const email = process.env.ADMIN2_EMAIL || process.env.UPLOAD_ADMIN_EMAIL;
  const password = process.env.ADMIN2_PASSWORD || process.env.UPLOAD_ADMIN_PASSWORD;
  const name = process.env.ADMIN2_NAME || 'MF Upload Admin';

  if (!email || !password) {
    console.error('Error: Missing ADMIN2_EMAIL (or UPLOAD_ADMIN_EMAIL) and ADMIN2_PASSWORD in environment variables.');
    process.exit(1);
  }

  try {
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`Admin2 user (${email}) already exists.`);
      process.exit(0);
    }

    await User.create({
      name,
      email,
      password,
      role: 'admin',
      isVerified: true
    });

    console.log(`Admin2 user created successfully with email: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin2 user:', error);
    process.exit(1);
  }
};

seedAdmin2();
