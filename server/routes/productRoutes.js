const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { cacheResponse } = require('../middlewares/cacheMiddleware');

router.route('/')
  .get(cacheResponse(180, 'products'), getProducts)
  .post(protect, adminOnly, createProduct);

router.route('/:id')
  .get(cacheResponse(300, 'products'), getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
