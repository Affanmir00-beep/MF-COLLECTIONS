const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, adminOnly, createCategory);

router.route('/:id')
  .delete(protect, adminOnly, deleteCategory);

module.exports = router;
