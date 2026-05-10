const express = require('express');
const { parseProduct } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Seller-only AI tools
router.post('/parse-product', protect, authorize('seller', 'admin'), parseProduct);

module.exports = router;
