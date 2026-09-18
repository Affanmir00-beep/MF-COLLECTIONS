const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { cacheResponse } = require('../middlewares/cacheMiddleware');

router.route('/')
  .get(cacheResponse(900, 'categories'), getCategories)
  .post(protect, adminOnly, createCategory);

router.route('/:id')
  .delete(protect, adminOnly, deleteCategory);

module.exports = router;
