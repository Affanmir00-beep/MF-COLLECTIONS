const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true }, // Cloudinary public_id — required to delete/replace safely
  alt: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false }
}, { _id: false });

const variantSchema = new mongoose.Schema({
  size: { type: String, enum: ['XS','S','M','L','XL','Free Size'], required: true },
  stock: { type: Number, required: true, default: 0, min: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 150 },
  slug: { type: String, required: true, unique: true, index: true, lowercase: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true }, // e.g. CF-005
  description: { type: String, required: true, maxlength: 3000 },
  fabricDetails: { type: String, maxlength: 1000 },
  careInstructions: [{ type: String, maxlength: 200 }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  collectionTag: { type: String, index: true }, // secondary tag, e.g. "New In", "Video Commerce"
  price: { type: Number, required: true, min: 0, index: true },
  compareAtPrice: { type: Number, min: 0 },
  images: {
    type: [imageSchema],
    validate: {
      validator: (v) => v.length >= 3 && v.length <= 8,
      message: 'A product must have between 3 and 8 images.'
    }
  },
  variants: {
    type: [variantSchema],
    validate: { validator: (v) => v.length > 0, message: 'At least one size/stock variant is required.' }
  },
  isVideoCommerce: { type: Boolean, default: false },
  videoUrl: String,
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false, index: true },
  isBestSeller: { type: Boolean, default: false, index: true },
  extraFields: [{
    label: { type: String, trim: true },
    value: { type: String, trim: true }
  }],
  badge: { type: String, enum: ['Restocked', 'Sold out', null], default: null },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalStock: { type: Number, default: 0 }, // denormalized sum of variants[].stock, updated in a pre-save hook
  soldCount: { type: Number, default: 0 } // incremented atomically on paid order (used for "N sold recently")
}, { timestamps: true });

// Unique compound index that also serves cursor pagination: newest-first within a category
productSchema.index({ category: 1, createdAt: -1, _id: -1 });
productSchema.index({ status: 1, createdAt: -1, _id: -1 });
productSchema.index({ title: 'text', description: 'text', sku: 'text' }, { weights: { title: 5, sku: 5, description: 1 } });

productSchema.pre('save', function () {
  this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);
  this.badge = this.totalStock === 0 ? 'Sold out' : this.badge === 'Sold out' ? null : this.badge;
});

module.exports = mongoose.model('Product', productSchema);
