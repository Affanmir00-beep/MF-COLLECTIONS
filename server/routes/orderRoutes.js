const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getOrders,
  trackGuestOrder
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 order creations per window
  message: 'Too many orders created from this IP, please try again after 15 minutes'
});

// Note: createOrder is public/auth because guest checkout is allowed
router.route('/')
  .post(orderLimiter, createOrder)
  .get(protect, adminOnly, getOrders);

router.post('/track', orderLimiter, trackGuestOrder);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .patch(protect, adminOnly, updateOrderStatus);

module.exports = router;
