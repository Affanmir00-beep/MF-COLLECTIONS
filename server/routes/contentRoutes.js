const express = require('express');
const router = express.Router();
const { getHomePageConfig, incrementVideoViews } = require('../controllers/contentController');
const { cacheResponse } = require('../middlewares/cacheMiddleware');

router.route('/homepage').get(cacheResponse(600, 'content'), getHomePageConfig);
router.route('/watch-buy/:videoId/view').post(incrementVideoViews);

module.exports = router;
