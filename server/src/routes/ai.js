const express = require('express');
const { parseProduct } = require('../controllers/aiController');
const { chat } = require('../controllers/aiChatController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Seller-only AI tools
router.post('/parse-product', protect, authorize('seller', 'admin'), parseProduct);

// General Chat AI (accessible to logged-in users)
router.post('/chat', protect, chat);

module.exports = router;
