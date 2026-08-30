const HomePageConfig = require('../models/HomePageConfig');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get homepage configuration
// @route   GET /api/v1/content/homepage
// @access  Public
const getHomePageConfig = asyncHandler(async (req, res) => {
  let config = await HomePageConfig.findOne();
  
  if (!config) {
    // Return default config if none exists
    config = await HomePageConfig.create({});
  }
  
  res.json(config);
});

// @desc    Update homepage configuration
// @route   PUT /api/v1/admin/content/homepage
// @access  Private/Admin
const updateHomePageConfig = asyncHandler(async (req, res) => {
  const { 
    heroSlider, 
    newInBanner,
    coOrdsBanner,
    storeLocatorBanner,
    collectionsGrid, 
    promoGrid, 
    watchAndBuy, 
    formalsSplit, 
    spottedGallery 
  } = req.body;

  let config = await HomePageConfig.findOne();
  
  if (!config) {
    config = new HomePageConfig();
  }

  if (heroSlider) config.heroSlider = heroSlider;
  if (newInBanner) config.newInBanner = newInBanner;
  if (coOrdsBanner) config.coOrdsBanner = coOrdsBanner;
  if (storeLocatorBanner) config.storeLocatorBanner = storeLocatorBanner;
  if (collectionsGrid) config.collectionsGrid = collectionsGrid;
  if (promoGrid) config.promoGrid = promoGrid;
  if (watchAndBuy) config.watchAndBuy = watchAndBuy;
  if (formalsSplit) config.formalsSplit = formalsSplit;
  if (spottedGallery) config.spottedGallery = spottedGallery;

  const updatedConfig = await config.save();
  res.json(updatedConfig);
});

// @desc    Increment video view count
// @route   POST /api/v1/content/watch-buy/:videoId/view
// @access  Public
const incrementVideoViews = asyncHandler(async (req, res) => {
  let config = await HomePageConfig.findOne();
  if (!config) {
    return res.json({ views: '1' });
  }

  const { videoId } = req.params;
  const item = config.watchAndBuy.id(videoId) || config.watchAndBuy[Number(videoId)];

  if (item) {
    const rawNum = parseInt((item.views || '0').replace(/[^0-9]/g, ''), 10) || 0;
    const newCount = rawNum + 1;
    item.views = newCount >= 1000 ? `${(newCount / 1000).toFixed(1)}K` : `${newCount}`;
    await config.save();
    return res.json({ views: item.views });
  }

  res.json({ message: 'View count processed' });
});

module.exports = {
  getHomePageConfig,
  updateHomePageConfig,
  incrementVideoViews
};
