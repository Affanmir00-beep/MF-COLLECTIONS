const Product = require('../models/Product');
const { paginateByCursor } = require('../utils/cursor');

// @desc    Fetch all products (with cursor pagination)
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res) => {
  const limit = Number(req.query.limit) || 12;
  const cursor = req.query.cursor;

  const keyword = req.query.keyword
    ? {
        $text: {
          $search: req.query.keyword,
        },
      }
    : {};

  const mongoose = require('mongoose');
  let categoryFilter = {};
  if (req.query.category) {
    if (mongoose.Types.ObjectId.isValid(req.query.category)) {
      categoryFilter = { category: req.query.category };
    } else {
      // If invalid object ID, ensure no products match instead of crashing
      categoryFilter = { category: new mongoose.Types.ObjectId() };
    }
  }
  
  const isNewArrival = req.query.isNewArrival === 'true' ? { isNewArrival: true } : {};
  const isBestSeller = req.query.isBestSeller === 'true' ? { isBestSeller: true } : {};
  const isSale = req.query.isSale === 'true' ? { $expr: { $gt: ["$compareAtPrice", "$price"] } } : {};
  const isVideoCommerce = req.query.isVideoCommerce === 'true' ? { isVideoCommerce: true } : {};
  
  const exclude = req.query.exclude ? { _id: { $ne: req.query.exclude } } : {};

  const filter = { ...keyword, ...categoryFilter, ...isNewArrival, ...isBestSeller, ...isSale, ...isVideoCommerce, ...exclude };

  try {
    const { items, nextCursor } = await paginateByCursor(Product, filter, { cursor, limit, sortDir: -1, populate: [{ path: 'category', select: 'slug' }] });
    res.json({ products: items, nextCursor });
  } catch (error) {
    res.status(400);
    throw new Error('Invalid cursor or query');
  }
};

// @desc    Fetch single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const mongoose = require('mongoose');
  let product;
  
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    product = await Product.findById(req.params.id).populate('category', 'slug');
  } else {
    product = await Product.findOne({ 
      $or: [
        { slug: req.params.id }, 
        { sku: req.params.id.toUpperCase() },
        { sku: req.params.id }
      ] 
    }).populate('category', 'slug');
  }

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const images = req.body.images || [];
  if (!Array.isArray(images) || images.length < 3 || images.length > 8) {
    res.status(400);
    throw new Error('A product must have between 3 and 8 images.');
  }

  let sku = req.body.sku;
  if (!sku) {
    let nextNumber = 49; // Default starting point
    const lastProduct = await Product.findOne({ sku: /^MFD-\d{3,}$/ }).sort({ sku: -1 });
    if (lastProduct) {
      const match = lastProduct.sku.match(/^MFD-(\d+)$/);
      if (match) {
        nextNumber = Math.max(nextNumber, parseInt(match[1], 10) + 1);
      }
    }
    sku = `MFD-${nextNumber.toString().padStart(3, '0')}`;
  }

  const product = new Product({
    title: req.body.title || 'Sample title',
    slug: req.body.slug || 'sample-title-' + Date.now(),
    sku: sku,
    description: req.body.description || 'Sample description',
    price: req.body.price || 0,
    category: req.body.category || 'Sample category',
    images: req.body.images || [],
    variants: req.body.variants || [],
    isVideoCommerce: req.body.isVideoCommerce || false,
    videoUrl: req.body.videoUrl || '',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    title, slug, sku, description, fabricDetails, careInstructions,
    category, collectionTag, price, compareAtPrice, images, variants,
    isVideoCommerce, videoUrl, isFeatured, isNewArrival, isBestSeller
  } = req.body;

  if (images) {
    if (!Array.isArray(images) || images.length < 3 || images.length > 8) {
      res.status(400);
      throw new Error('A product must have between 3 and 8 images.');
    }
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    product.title = title || product.title;
    product.slug = slug || product.slug;
    product.sku = sku || product.sku;
    product.description = description || product.description;
    product.fabricDetails = fabricDetails || product.fabricDetails;
    product.careInstructions = careInstructions || product.careInstructions;
    product.category = category || product.category;
    product.collectionTag = collectionTag || product.collectionTag;
    product.price = price || product.price;
    product.compareAtPrice = compareAtPrice || product.compareAtPrice;
    product.images = images || product.images;
    product.variants = variants || product.variants;
    product.isVideoCommerce = isVideoCommerce !== undefined ? isVideoCommerce : product.isVideoCommerce;
    product.videoUrl = videoUrl || product.videoUrl;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;
    product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
