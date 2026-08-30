const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  image: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  publicId: { type: String },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  link: { type: String, default: '/' },
});

const collectionSchema = new mongoose.Schema({
  image: { type: String, required: true },
  publicId: { type: String },
  title: { type: String, required: true },
  link: { type: String, required: true, default: '/' },
});

const promoSchema = new mongoose.Schema({
  image: { type: String, required: true },
  publicId: { type: String },
  title: { type: String, required: true },
  subtitle: { type: String },
  linkText: { type: String, required: true },
  link: { type: String, required: true, default: '/' },
});

const videoSchema = new mongoose.Schema({
  videoUrl: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  publicId: { type: String },
  productSku: { type: String, default: '' },
  views: { type: String, default: '0' },
});

const formalsSchema = new mongoose.Schema({
  image: { type: String, required: true },
  publicId: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  buttonText: { type: String, required: true },
  link: { type: String, required: true, default: '/' },
});

const spottedSchema = new mongoose.Schema({
  image: { type: String, required: true },
  publicId: { type: String },
  link: { type: String, required: true, default: '/' },
});

const bannerSchema = new mongoose.Schema({
  image: { type: String, default: '' },
  publicId: { type: String },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  link: { type: String, default: '/' },
});

const homePageConfigSchema = new mongoose.Schema({
  heroSlider: {
    type: [slideSchema],
    default: [
      {
        image: '/images/hero.jpg',
        videoUrl: '',
        title: 'THE SILK EDIT',
        subtitle: 'LUXURY PRET',
        link: '/collections/solana'
      },
      {
        image: '/images/banner1.jpg',
        videoUrl: '',
        title: 'FESTIVE COLLECTION',
        subtitle: 'UNSTITCHED',
        link: '/collections/dastaan'
      }
    ]
  },
  newInBanner: {
    type: bannerSchema,
    default: {
      image: '/images/hero.jpg',
      title: 'NEW IN',
      subtitle: '"Fresh arrivals that redefine everyday elegance. Curated pieces crafted to elevate your style with every wear."',
      link: '/collections/new-arrivals'
    }
  },
  coOrdsBanner: {
    type: bannerSchema,
    default: {
      image: '/images/banner1.jpg',
      title: 'CO-ORDS',
      subtitle: 'PERFECTLY PUT TOGETHER',
      link: '/collections/co-ords'
    }
  },
  storeLocatorBanner: {
    type: bannerSchema,
    default: {
      image: '/images/banner2.jpg',
      title: 'STORE LOCATOR',
      subtitle: 'Step Into The World Of VANYA',
      link: '/store-locator'
    }
  },
  collectionsGrid: {
    type: [collectionSchema],
    default: [
      { title: "READY TO WEAR\nEASTERN '23", link: '/collections/luxury-pret', image: '/images/hero.jpg' },
      { title: "WESTERN WEAR", link: '/collections/solana', image: '/images/banner1.jpg' },
      { title: "JUNIORS", link: '/collections/dastaan', image: '/images/banner2.jpg' }
    ]
  },
  promoGrid: {
    type: [promoSchema],
    default: [
      { title: "Eastern '23", subtitle: "Ready to Wear", linkText: "Shop the Look", link: "/collections/virsa", image: "/images/prod1.jpg" },
      { title: "Western Wear", linkText: "Discover", link: "/collections/dastaan", image: "/images/banner1.jpg" },
      { title: "JUNIORS", linkText: "Shop Now", link: "/collections/luxury-pret", image: "/images/prod2.jpg" }
    ]
  },
  watchAndBuy: {
    type: [videoSchema],
    default: [
      { videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", coverImage: "/images/hero.jpg", productSku: "CF-001", views: "4K" },
      { videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", coverImage: "/images/prod1.jpg", productSku: "CF-002", views: "1.2K" },
      { videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", coverImage: "/images/prod2.jpg", productSku: "CF-003", views: "854" },
      { videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", coverImage: "/images/prod5.jpg", productSku: "CF-004", views: "12K" },
      { videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", coverImage: "/images/banner1.jpg", productSku: "CF-005", views: "2K" }
    ]
  },
  formalsSplit: {
    type: formalsSchema,
    default: {
      image: "/images/banner1.jpg",
      title: "FORMALS",
      description: "Elegant silhouettes, exquisite details, and effortless sophistication. Designed for special moments, our formals bring timeless grace to every occasion.",
      buttonText: "EXPLORE",
      link: "/collections/dastaan"
    }
  },
  spottedGallery: {
    type: [spottedSchema],
    default: [
      { image: '/images/hero.jpg', link: 'https://instagram.com' },
      { image: '/images/banner1.jpg', link: 'https://instagram.com' },
      { image: '/images/prod1.jpg', link: 'https://instagram.com' },
      { image: '/images/prod2.jpg', link: 'https://instagram.com' },
      { image: '/images/prod5.jpg', link: 'https://instagram.com' }
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('HomePageConfig', homePageConfigSchema);
