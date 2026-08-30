const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Search products (Tier 1: MongoDB Text Search + Regex fallback)
// @route   GET /api/v1/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query;
  const parsedLimit = parseInt(limit, 10) || 10;

  if (!q) {
    return res.json([]);
  }

  // Tier 1 Search Strategy:
  // 1. First try $text search which uses the weighted index (title: 5, sku: 5, description: 1)
  let products = await Product.find(
    { $text: { $search: q }, status: 'published' },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parsedLimit);

  // 2. If text search yields very few results (or it's a partial word/autocomplete),
  // fallback to a regex search on title or sku.
  if (products.length < parsedLimit) {
    const regex = new RegExp(q, 'i');
    const existingIds = products.map(p => p._id);
    
    const fallbackProducts = await Product.find({
      _id: { $nin: existingIds },
      status: 'published',
      $or: [
        { title: { $regex: regex } },
        { sku: { $regex: regex } }
      ]
    }).limit(parsedLimit - products.length);

    products = [...products, ...fallbackProducts];
  }

  // Map to frontend DTO shape
  const items = products.map(p => ({
    id: p._id,
    title: p.title,
    slug: p.slug,
    price: p.price,
    images: p.images.length > 0 ? p.images.map(img => img.url) : ['/images/placeholder.jpg'],
    badge: p.badge,
    category: p.category
  }));

  res.json(items);
});

module.exports = { searchProducts };
