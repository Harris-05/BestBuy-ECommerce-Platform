const express = require('express');
const {
  createPaymentIntent,
  placeOrder,
  getMyOrders,
  getSellerOrders,
  sellerOrderStream,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Payment intent must come before /:id routes
router.post('/payment-intent',  protect, createPaymentIntent);

router.post('/',                protect, placeOrder);
router.get('/my',               protect, getMyOrders);
router.get('/seller',           protect, authorize('seller', 'admin'), getSellerOrders);
router.get('/seller/stream',    protect, authorize('seller', 'admin'), sellerOrderStream);
router.patch('/:id/status',     protect, authorize('seller', 'admin'), updateOrderStatus);

module.exports = router;
