const Category = require('../models/Category');
const Product = require('../models/Product');
const { invalidateCache } = require('../middlewares/cacheMiddleware');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find({}).lean();
  res.json(categories);
};

// @desc    Create a category
// @route   POST /api/v1/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, description, coverImage } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const categoryExists = await Category.findOne({ slug });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    name,
    slug,
    description,
    coverImage
  });

  invalidateCache('categories');
  invalidateCache('content');
  res.status(201).json(category);
};

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check if any products are using this category
  const productsInCategory = await Product.countDocuments({ 
    $or: [{ category: category._id }, { category: category.name }] 
  });
  
  if (productsInCategory > 0) {
    res.status(400);
    throw new Error(`Cannot delete category. There are ${productsInCategory} products in this category. Reassign them first.`);
  }

  if (category.coverImage?.publicId) {
    try {
      const cloudinary = require('cloudinary').v2;
      await cloudinary.uploader.destroy(category.coverImage.publicId);
    } catch (e) {
      console.warn('Cloudinary image deletion skipped during category delete:', e.message);
    }
  }

  await Category.deleteOne({ _id: category._id });
  invalidateCache('categories');
  invalidateCache('content');
  res.json({ message: 'Category removed successfully' });
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory
};
