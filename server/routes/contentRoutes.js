const express = require('express');
const router = express.Router();
const { getHomePageConfig, incrementVideoViews } = require('../controllers/contentController');

router.route('/homepage').get(getHomePageConfig);
router.route('/watch-buy/:videoId/view').post(incrementVideoViews);

module.exports = router;
