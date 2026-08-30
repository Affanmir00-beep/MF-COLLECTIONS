const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { protect, adminOnly, superAdminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const { heavyOpsLimiter } = require('../middlewares/rateLimiters');

const { uploadImages } = require('../controllers/uploadController');
const {
  getDashboardSummary,
  createProduct, updateProduct, updateProductStock, deleteProduct, getAdminProducts,
  createCategory, updateCategory, deleteCategory,
  getAdminOrders, updateOrderStatus,
  getAdminUsers, updateUserRole
} = require('../controllers/adminController');

const {
  createProductSchema, updateProductSchema, updateStockSchema,
  createCategorySchema, updateCategorySchema,
  updateOrderStatusSchema
} = require('../validators/product.schema'); // wait, schemas are split

// Note: I will dynamically require them to avoid missing ones in this short snippet
const productSchema = require('../validators/product.schema');
const categorySchema = require('../validators/category.schema');
const orderSchema = require('../validators/order.schema');

router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard/summary', getDashboardSummary);

// Uploads
router.post('/uploads', heavyOpsLimiter, upload.array('images', 8), uploadImages);

// Products
router.route('/products')
  .get(getAdminProducts)
  .post(validate(productSchema.createProductSchema), createProduct);

router.route('/products/:id')
  .put(validate(productSchema.updateProductSchema), updateProduct)
  .delete(deleteProduct);

router.patch('/products/:id/stock', validate(productSchema.updateStockSchema), updateProductStock);

// Categories
router.post('/categories', validate(categorySchema.createCategorySchema), createCategory);
router.route('/categories/:id')
  .put(validate(categorySchema.updateCategorySchema), updateCategory)
  .delete(deleteCategory);

// Orders
router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', validate(orderSchema.updateOrderStatusSchema), updateOrderStatus);

// Users (Superadmin only)
router.get('/users', superAdminOnly, getAdminUsers);
router.patch('/users/:id/role', superAdminOnly, updateUserRole);

// Content Management
const { updateHomePageConfig } = require('../controllers/contentController');
router.put('/content/homepage', updateHomePageConfig);

module.exports = router;
