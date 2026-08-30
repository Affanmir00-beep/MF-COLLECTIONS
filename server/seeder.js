require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vanya-clone');

const seedData = async () => {
  try {
    // DO NOT delete users, so admin persists if they already logged in, but delete cats and products to prevent unique constraints errors
    await Category.deleteMany();
    await Product.deleteMany();
    
    // Create an admin user first
    let admin = await User.findOne({ email: 'admin@vanya.pk' });
    if (!admin) {
      admin = await User.create({
        name: 'Vanya Admin',
        email: 'admin@vanya.pk',
        password: 'password123',
        role: 'superadmin',
        isVerified: true
      });
      console.log('Admin user created: admin@vanya.pk / password123');
    }

    const categories = [
      { name: 'New In', slug: 'new-in', coverImage: { url: '/images/banner1.jpg', publicId: 'dummy' }, sortOrder: 1 },
      { name: 'Unstitched', slug: 'unstitched', coverImage: { url: '/images/banner2.jpg', publicId: 'dummy' }, sortOrder: 2 },
      { name: 'Fancy Formals', slug: 'fancy-formals', coverImage: { url: '/images/banner1.jpg', publicId: 'dummy' }, sortOrder: 3 },
      { name: 'Velvet', slug: 'velvet', coverImage: { url: '/images/banner2.jpg', publicId: 'dummy' }, sortOrder: 4 },
      { name: 'Dastaan', slug: 'dastaan', coverImage: { url: '/images/banner1.jpg', publicId: 'dummy' }, sortOrder: 5 },
      { name: 'Co-ords', slug: 'co-ords', coverImage: { url: '/images/banner2.jpg', publicId: 'dummy' }, sortOrder: 6 },
      { name: 'Ready To Wear', slug: 'ready-to-wear', coverImage: { url: '/images/banner1.jpg', publicId: 'dummy' }, sortOrder: 7 },
      { name: 'Solana', slug: 'solana', coverImage: { url: '/images/banner2.jpg', publicId: 'dummy' }, sortOrder: 8 },
    ];

    const insertedCategories = await Category.insertMany(categories);
    console.log('Categories seeded.');

    // Create a few products for each category
    const products = [];
    for (const cat of insertedCategories) {
      for (let i = 1; i <= 3; i++) {
        products.push({
          title: `${cat.name} Masterpiece ${i}`,
          slug: `${cat.slug}-masterpiece-${i}`,
          sku: `SKU-${cat.slug.toUpperCase()}-${100 + i}`,
          description: `A beautiful piece from the ${cat.name} collection. Elegant and timeless.`,
          category: cat._id,
          price: 15000 + (i * 1000),
          images: [
            { url: '/images/product1.jpg', publicId: `dummy1-${i}`, isPrimary: true },
            { url: '/images/product2.jpg', publicId: `dummy2-${i}` },
            { url: '/images/product3.jpg', publicId: `dummy3-${i}` }
          ],
          variants: [
            { size: 'S', stock: 10 },
            { size: 'M', stock: 15 },
            { size: 'L', stock: 5 }
          ],
          status: 'published',
          createdBy: admin._id
        });
      }
    }

    await Product.insertMany(products);
    console.log('Products seeded.');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
