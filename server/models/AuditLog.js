const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // 'PRODUCT_CREATE' | 'PRODUCT_DELETE' | 'ORDER_STATUS_UPDATE' | ...
  entityType: { type: String, required: true }, // 'Product' | 'Category' | 'Order' | 'User'
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  before: mongoose.Schema.Types.Mixed,
  after: mongoose.Schema.Types.Mixed,
  ip: String,
}, { timestamps: true });

auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
