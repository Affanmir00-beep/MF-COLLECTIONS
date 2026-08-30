const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { notifyAdminNewOrder, notifyCustomerOrder } = require('../services/notification.service');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Public / Private
const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsSubtotal,
    shippingFee,
    grandTotal,
    guestInfo
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Verify and decrement stock for each item
    for (const item of orderItems) {
      const product = await Product.findById(item.product).session(session);
      
      if (!product) {
        throw new Error(`Product not found: ${item.title}`);
      }

      const variantIndex = product.variants.findIndex(v => v.size === item.size);
      
      if (variantIndex === -1) {
        throw new Error(`Size ${item.size} not found for product ${product.title}`);
      }

      if (product.variants[variantIndex].stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title} (Size: ${item.size})`);
      }

      // Decrement stock
      product.variants[variantIndex].stock -= item.quantity;
      await product.save({ session });
    }

    // 2. Create the order
    const orderNumber = 'VAN-' + Math.floor(100000 + Math.random() * 900000); // Simple order number generator

    const order = new Order({
      orderNumber,
      user: req.user ? req.user._id : null,
      guestInfo: req.user ? undefined : guestInfo,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsSubtotal,
      shippingFee,
      grandTotal,
    });

    const createdOrder = await order.save({ session });

    // 3. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 4. Send Notifications asynchronously (outside transaction)
    notifyAdminNewOrder(createdOrder).catch(console.error);
    notifyCustomerOrder(createdOrder).catch(console.error);

    res.status(201).json(createdOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Check if user is admin or the order belongs to the user
    if (
      (req.user && req.user.role === 'admin') || 
      (req.user && req.user.role === 'superadmin') ||
      (order.user && order.user.equals(req.user._id))
    ) {
      res.json(order);
    } else {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/v1/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { orderStatus, courierName, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = orderStatus || order.orderStatus;
    order.courierName = courierName || order.courierName;
    order.trackingNumber = trackingNumber || order.trackingNumber;
    
    if (orderStatus === 'SHIPPED') {
      order.dispatchedAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Order.countDocuments({});
  const orders = await Order.find({})
    .populate('user', 'id name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ orders, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Track guest order
// @route   POST /api/v1/orders/track
// @access  Public
const trackGuestOrder = async (req, res) => {
  const { orderNumber, email } = req.body;

  if (!orderNumber || !email) {
    res.status(400);
    throw new Error('Please provide both order number and email');
  }

  const order = await Order.findOne({ orderNumber });

  if (order) {
    // Verify that it's a guest order and the email matches
    if (order.guestInfo && order.guestInfo.email.toLowerCase() === email.toLowerCase()) {
      res.json(order);
    } else {
      res.status(403);
      throw new Error('Not authorized to view this order. Ensure the email matches the one used during checkout.');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getOrders,
  trackGuestOrder
};
