const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const asyncHandler = require('../utils/asyncHandler');
const { logAction } = require('../services/audit.service');
const cloudinary = require('cloudinary').v2;

const getDashboardSummary = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const [
    ordersToday,
    ordersThisWeek,
    lowStockProducts,
    pendingOrders,
    bestSellers,
    recentAuditLogs
  ] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: startOfDay } }),
    Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
    Product.find({ totalStock: { $lt: 5 } }).select('title sku totalStock badge'),
    Order.countDocuments({ orderStatus: 'ORDER_PLACED' }),
    Product.find().sort({ soldCount: -1 }).limit(5).select('title soldCount'),
    AuditLog.find().sort({ createdAt: -1 }).limit(10).populate('actor', 'name email')
  ]);

  res.json({ ordersToday, ordersThisWeek, lowStockProducts, pendingOrders, bestSellers, recentAuditLogs });
});

// Products
const createProduct = asyncHandler(async (req, res) => {
  let sku = req.body.sku;
  if (!sku) {
    let nextNumber = 49;
    const lastProduct = await Product.findOne({ sku: /^MFD-\d{3,}$/ }).sort({ sku: -1 });
    if (lastProduct) {
      const match = lastProduct.sku.match(/^MFD-(\d+)$/);
      if (match) {
        nextNumber = Math.max(nextNumber, parseInt(match[1], 10) + 1);
      }
    }
    sku = `MFD-${nextNumber.toString().padStart(3, '0')}`;
  }

  const product = new Product({ ...req.body, sku, createdBy: req.user._id });
  const createdProduct = await product.save();
  await logAction({ actor: req.user._id, action: 'PRODUCT_CREATE', entityType: 'Product', entityId: createdProduct._id, after: createdProduct });
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const before = product.toObject();
  Object.assign(product, req.body);
  const updatedProduct = await product.save();
  
  await logAction({ actor: req.user._id, action: 'PRODUCT_UPDATE', entityType: 'Product', entityId: updatedProduct._id, before, after: updatedProduct });
  res.json(updatedProduct);
});

const updateProductStock = asyncHandler(async (req, res) => {
  const { size, delta } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const variant = product.variants.find(v => v.size === size);
  if (!variant) { res.status(404); throw new Error('Variant not found'); }

  variant.stock += delta;
  if (variant.stock < 0) variant.stock = 0;
  
  await product.save(); 
  await logAction({ actor: req.user._id, action: 'PRODUCT_RESTOCK', entityType: 'Product', entityId: product._id, after: { size, newStock: variant.stock } });
  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const isInOrder = await Order.exists({ 'orderItems.product': product._id });
  
  if (isInOrder) {
    product.status = 'archived';
    await product.save();
    await logAction({ actor: req.user._id, action: 'PRODUCT_SOFT_DELETE', entityType: 'Product', entityId: product._id });
    res.json({ message: 'Product archived (soft-deleted because it appears in orders)' });
  } else {
    for (const img of product.images) {
      if (img.publicId && !img.publicId.startsWith('local-')) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (e) {
          console.warn('Cloudinary product image delete ignored:', e.message);
        }
      }
    }
    await product.deleteOne();
    await logAction({ actor: req.user._id, action: 'PRODUCT_HARD_DELETE', entityType: 'Product', entityId: product._id });
    res.json({ message: 'Product permanently deleted' });
  }
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  
  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter).populate('category', 'name').sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// Categories
const createCategory = asyncHandler(async (req, res) => {
  const cat = new Category(req.body);
  await cat.save();
  await logAction({ actor: req.user._id, action: 'CATEGORY_CREATE', entityType: 'Category', entityId: cat._id, after: cat });
  res.status(201).json(cat);
});

const updateCategory = asyncHandler(async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) { res.status(404); throw new Error('Category not found'); }
  const before = cat.toObject();
  Object.assign(cat, req.body);
  await cat.save();
  await logAction({ actor: req.user._id, action: 'CATEGORY_UPDATE', entityType: 'Category', entityId: cat._id, before, after: cat });
  res.json(cat);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) { res.status(404); throw new Error('Category not found'); }
  
  const hasProducts = await Product.exists({ category: cat._id });
  if (hasProducts) { res.status(400); throw new Error('Cannot delete category with products'); }

  if (cat.coverImage?.publicId) {
    try {
      await cloudinary.uploader.destroy(cat.coverImage.publicId);
    } catch (e) {
      console.warn('Cloudinary deletion ignored during category removal:', e.message);
    }
  }
  
  await cat.deleteOne();
  await logAction({ actor: req.user._id, action: 'CATEGORY_DELETE', entityType: 'Category', entityId: cat._id });
  res.json({ message: 'Category deleted successfully' });
});

// Orders
const getAdminOrders = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const filter = {};
  if (req.query.orderStatus) filter.orderStatus = req.query.orderStatus;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  
  const count = await Order.countDocuments(filter);
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * (page - 1));
  res.json({ orders, page, pages: Math.ceil(count / pageSize), total: count });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  const before = order.toObject();
  order.orderStatus = status;
  order.statusHistory.push({
    status,
    changedBy: req.user._id,
    note
  });
  
  await order.save();
  await logAction({ actor: req.user._id, action: 'ORDER_STATUS_UPDATE', entityType: 'Order', entityId: order._id, before, after: order });
  res.json(order);
});

// Users
const getAdminUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body; // customer, admin, superadmin
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  const before = user.toObject();
  user.role = role;
  await user.save();
  await logAction({ actor: req.user._id, action: 'USER_ROLE_UPDATE', entityType: 'User', entityId: user._id, before, after: user });
  res.json(user);
});

module.exports = {
  getDashboardSummary,
  createProduct, updateProduct, updateProductStock, deleteProduct, getAdminProducts,
  createCategory, updateCategory, deleteCategory,
  getAdminOrders, updateOrderStatus,
  getAdminUsers, updateUserRole
};
