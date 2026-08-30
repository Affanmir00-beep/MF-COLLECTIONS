const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  guestInfo: { 
    name: String, 
    email: String, 
    phone: String 
  },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String, 
    size: String, 
    quantity: Number, 
    price: Number, 
    image: String
  }],
  shippingAddress: { 
    fullName: String, 
    phone: String, 
    addressLine: String, 
    city: String, 
    province: String 
  },
  paymentMethod: { type: String, enum: ['COD', 'CARD', 'JAZZCASH', 'EASYPAISA'], required: true },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
  orderStatus: { 
    type: String, 
    enum: ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], 
    default: 'ORDER_PLACED' 
  },
  statusHistory: [{
    status: { type: String, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
    note: { type: String }
  }],
  adminNotifiedAt: { type: Date },
  itemsSubtotal: Number, 
  shippingFee: Number, 
  grandTotal: Number,
  courierName: String, 
  trackingNumber: String, 
  dispatchedAt: Date
}, {
  timestamps: true
});

// Compound index to quickly fetch a user's recent orders
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
