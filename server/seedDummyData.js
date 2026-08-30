const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vanya-clone');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Curated fashion images from Unsplash (Pakistani/South Asian fashion aesthetic)
const fashionImages = [
  ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&q=80&w=800'],
  ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&q=80&w=800'],
  ['https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'],
  ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&q=80&w=800'],
  ['https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800'],
  ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800'],
];

const productNames = {
  'Luxury Pret': ['Emerald Elegance', 'Pearl Whisper', 'Sapphire Reign', 'Ivory Grace', 'Rose Bloom', 'Midnight Luxe', 'Golden Aura'],
  'Festive Edit': ['Eid Gala', 'Festive Bloom', 'Celebration Noir', 'Radiance', 'Moonlit Affair', 'Sparkle Divine', 'Festive Pearl'],
  'Wedding Edit': ['Bridal Bliss', 'Walima Grace', 'Mehndi Dream', 'Baraat Royale', 'Nikkah Elegance', 'Reception Bloom', 'Wedding Charm'],
  'Kaftans': ['Silk Breeze', 'Flowing Majesty', 'Ethereal Drift', 'Summer Silk', 'Luxe Drape', 'Desert Rose', 'Coastal Chic'],
  'Farshi Shalwar': ['Royal Farshi', 'Palazzo Dream', 'Wide Leg Luxe', 'Regal Flow', 'Heritage Farshi', 'Classic Palazzo'],
  'Pishwas': ['Anarkali Dream', 'Floral Pishwas', 'Embroidered Glory', 'Sheer Elegance', 'Tiered Beauty', 'Classic Pishwas'],
  'New Arrivals': ['Summer 25 Collection I', 'Summer 25 Collection II', 'Fresh Prints', 'Modern Minimal', 'Abstract Art', 'Geometric Grace'],
  'Sale': ['Clearance Luxe', 'Last Season Edit', 'Value Collection I', 'Value Collection II', 'End of Season I', 'End of Season II'],
};

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    // 1. Create Admin & Customer
    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@mfdesigns.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'password123',
        role: 'customer',
      }
    ]);

    // 2. Create MF Designs Categories
    const categoriesData = [
      { name: 'Luxury Pret', slug: 'luxury-pret', description: 'Elegant ready-to-wear outfits featuring premium fabrics and detailed finishing.', coverImage: { url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800', publicId: 'cat_luxury_pret' } },
      { name: 'Festive Edit', slug: 'festive-edit', description: 'Statement pieces designed for Eid, festive gatherings and special occasions.', coverImage: { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800', publicId: 'cat_festive' } },
      { name: 'Wedding Edit', slug: 'wedding-edit', description: 'Elegant outfits suitable for mehndi, baraat, walima and other wedding events.', coverImage: { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', publicId: 'cat_wedding' } },
      { name: 'Kaftans', slug: 'kaftans', description: 'Flowing, sophisticated kaftans designed for effortless elegance.', coverImage: { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800', publicId: 'cat_kaftans' } },
      { name: 'Farshi Shalwar', slug: 'farshi-shalwar', description: 'Wide-leg palazzo and farshi shalwar styles with royal finishing.', coverImage: { url: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&q=80&w=800', publicId: 'cat_farshi' } },
      { name: 'Pishwas', slug: 'pishwas', description: 'Traditional anarkali and pishwas designs with intricate embroidery.', coverImage: { url: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&q=80&w=800', publicId: 'cat_pishwas' } },
      { name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest MF Designs pieces and newly launched designs.', coverImage: { url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800', publicId: 'cat_new' } },
      { name: 'Sale', slug: 'sale', description: 'Selected pieces available at special prices.', coverImage: { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800', publicId: 'cat_sale' } },
    ];

    const createdCategories = await Category.create(categoriesData);
    const adminUser = createdUsers[0];

    // 3. Create 40+ Products (enough for pagination)
    const productsToInsert = [];
    let skuCounter = 1;

    createdCategories.forEach((cat, catIndex) => {
      const names = productNames[cat.name] || ['Design I', 'Design II', 'Design III', 'Design IV', 'Design V', 'Design VI'];

      names.forEach((name, i) => {
        const imgSet = fashionImages[(skuCounter - 1) % fashionImages.length];
        const basePrice = 8000 + Math.floor(Math.random() * 25000);
        const hasDiscount = cat.name === 'Sale' || Math.random() > 0.7;

        productsToInsert.push({
          title: `${name}`,
          slug: `${cat.slug}-${name.toLowerCase().replace(/\s+/g, '-')}-${skuCounter}`,
          sku: `MFD-${String(skuCounter).padStart(3, '0')}`,
          description: `Experience the elegance of MF Designs ${cat.name} collection. "${name}" features intricate handcrafted details including dabka, zardozi, gota, pearls and sequin work. Premium fabric with beautiful finishing — designed to make you feel confident, elegant and uniquely yourself.`,
          fabricDetails: 'Premium chiffon/organza with hand-embroidered front panel. Includes dupatta and matching trousers/shalwar.',
          careInstructions: ['Dry clean only', 'Do not bleach', 'Iron at low temperature', 'Store in garment bag'],
          category: cat._id,
          collectionTag: cat.name,
          price: basePrice,
          compareAtPrice: hasDiscount ? basePrice + Math.floor(Math.random() * 8000) + 3000 : undefined,
          images: imgSet.map((url, idx) => ({
            url,
            alt: `${name} - View ${idx + 1}`,
            isPrimary: idx === 0,
            publicId: `mfd_product_${skuCounter}_${idx}`
          })),
          variants: [
            { size: 'XS', stock: Math.floor(Math.random() * 5) },
            { size: 'S', stock: Math.floor(Math.random() * 10) + 2 },
            { size: 'M', stock: Math.floor(Math.random() * 15) + 5 },
            { size: 'L', stock: Math.floor(Math.random() * 10) + 3 },
            { size: 'XL', stock: Math.floor(Math.random() * 5) + 1 },
          ],
          isNewArrival: cat.name === 'New Arrivals' || i < 2,
          isBestSeller: i === 1 || i === 2,
          isFeatured: i === 0,
          status: 'published',
          createdBy: adminUser._id
        });
        skuCounter++;
      });
    });

    await Product.create(productsToInsert);

    console.log('MF Designs Data Imported Successfully!');
    console.log(`- Created 2 Users (Admin: admin@mfdesigns.com, password123)`);
    console.log(`- Created ${createdCategories.length} Categories`);
    console.log(`- Created ${productsToInsert.length} Products`);
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
