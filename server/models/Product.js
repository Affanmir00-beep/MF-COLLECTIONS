const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['pret', 'luxury-pret', 'formals', 'unstitched', 'bottoms'],
    },
    fabric: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    sizes: [
      {
        size: {
          type: String,
          enum: ['XS', 'S', 'M', 'L', 'XL'],
        },
        stock: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
      },
    ],
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
