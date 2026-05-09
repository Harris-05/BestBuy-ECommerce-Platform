const express = require('express');
const {
  placeOrder, getMyOrders, getSellerOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/',              protect, placeOrder);
router.get('/my',             protect, getMyOrders);
router.get('/seller',         protect, authorize('seller', 'admin'), getSellerOrders);
router.patch('/:id/status',   protect, authorize('seller', 'admin'), updateOrderStatus);

module.exports = router;
