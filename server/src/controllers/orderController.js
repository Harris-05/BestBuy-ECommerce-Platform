const Order   = require('../models/Order');
const Product = require('../models/Product');

// @desc    Place a new order
// @route   POST /api/orders
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Enrich items with product data + seller ref
    const enriched = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId ?? item.product);
      if (!product) continue;
      const qty = item.quantity ?? 1;
      const price = product.price;
      enriched.push({
        product:  product._id,
        name:     product.name,
        price,
        quantity: qty,
        image:    product.images?.[0] ?? '',
        seller:   product.seller,
      });
      total += price * qty;
    }

    const order = await Order.create({
      user:            req.user.id,
      items:           enriched,
      shippingAddress: shippingAddress ?? {},
      paymentMethod:   paymentMethod ?? 'COD',
      total,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders that contain current seller's products
// @route   GET /api/orders/seller
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user.id })
      .populate('items.product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (seller or admin)
// @route   PATCH /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isSeller = order.items.some(i => i.seller?.toString() === req.user.id);
    if (!isSeller && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered  = true;
      order.deliveredAt  = new Date();
    }
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
