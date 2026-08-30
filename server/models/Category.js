const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
  slug: { type: String, required: true, unique: true, index: true, lowercase: true },
  description: { type: String, default: '', maxlength: 500 },
  coverImage: {
    url: { type: String, required: true },
    publicId: { type: String, default: '' }
  },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }, // controls homepage grid order (Dastaan, Postcards... etc.)
  productCount: { type: Number, default: 0 } // denormalized counter, kept in sync via hooks
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
