const express = require('express');
const router = express.Router();
const { searchProducts } = require('../controllers/searchController');
const { heavyOpsLimiter } = require('../middlewares/rateLimiters');

router.get('/', heavyOpsLimiter, searchProducts);

module.exports = router;
