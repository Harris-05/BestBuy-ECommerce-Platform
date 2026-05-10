const Order   = require('../models/Order');
const Product = require('../models/Product');
const User    = require('../models/User');
const { sendSellerNewOrderEmail, sendCustomerOrderConfirmation } = require('../services/emailService');
const sse     = require('../services/sseManager');

// Normalise frontend payment method strings to the enum values in Order schema
const METHOD_MAP = { cod: 'COD', card: 'Stripe', stripe: 'Stripe' };

// @desc    Create Stripe PaymentIntent (called before placing a card order)
// @route   POST /api/orders/payment-intent
exports.createPaymentIntent = async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ success: false, message: 'Stripe is not configured on this server. Add STRIPE_SECRET_KEY to .env' });
  }
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount } = req.body; // in cents
    if (!amount || amount < 50) {
      return res.status(400).json({ success: false, message: 'Invalid amount (minimum 50 cents)' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'usd',
      metadata: { userId: String(req.user._id) },
    });
    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Place a new order
// @route   POST /api/orders
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentIntentId } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const normalizedMethod = METHOD_MAP[(paymentMethod ?? 'COD').toLowerCase()] ?? 'COD';

    // Enrich items with live product data and seller reference
    const enriched = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId ?? item.product);
      if (!product) continue;
      const qty = item.quantity ?? 1;
      enriched.push({
        product:  product._id,
        name:     product.name,
        price:    product.price,
        quantity: qty,
        image:    product.images?.[0] ?? '',
        seller:   product.seller,
      });
      total += product.price * qty;
    }

    if (!enriched.length) {
      return res.status(400).json({ success: false, message: 'No valid products found in order' });
    }

    const isPaid = normalizedMethod === 'Stripe' && !!paymentIntentId;

    const order = await Order.create({
      user:            req.user._id,
      items:           enriched,
      shippingAddress: shippingAddress ?? {},
      paymentMethod:   normalizedMethod,
      total,
      isPaid,
      paidAt:          isPaid ? new Date() : undefined,
    });

    // Group enriched items by seller for targeted notifications
    const bySellerMap = new Map();
    for (const item of enriched) {
      const sid = item.seller?.toString();
      if (!sid) continue;
      if (!bySellerMap.has(sid)) bySellerMap.set(sid, []);
      bySellerMap.get(sid).push(item);
    }

    // Notify each unique seller via SSE + email (non-blocking)
    for (const [sellerId, sellerItems] of bySellerMap) {
      // Live SSE push
      sse.emit(sellerId, 'new_order', {
        _id:       order._id,
        orderRef:  order._id.toString().slice(-8).toUpperCase(),
        total:     order.total,
        status:    order.status,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        items: sellerItems.map(i => ({
          name:     i.name,
          price:    i.price,
          quantity: i.quantity,
          image:    i.image,
          product:  { _id: i.product, name: i.name, images: [i.image] },
        })),
      });

      // Email (fire-and-forget)
      User.findById(sellerId)
        .then(seller => {
          if (seller?.email) {
            sendSellerNewOrderEmail(seller.email, seller.name, order, sellerItems).catch(() => {});
          }
        })
        .catch(() => {});
    }

    // Customer confirmation email (fire-and-forget)
    User.findById(req.user._id)
      .then(customer => {
        if (customer?.email) {
          sendCustomerOrderConfirmation(customer.email, customer.name, order).catch(() => {});
        }
      })
      .catch(() => {});

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders containing current seller's products
// @route   GET /api/orders/seller
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('items.product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    SSE stream — pushes new_order events to the connected seller in real time
// @route   GET /api/orders/seller/stream
exports.sellerOrderStream = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
  res.flushHeaders();

  sse.subscribe(req.user._id, res);

  // Send initial connected confirmation
  res.write(`event: connected\ndata: ${JSON.stringify({ sellerId: String(req.user._id) })}\n\n`);

  // Heartbeat every 25s to keep the connection alive through proxies
  const heartbeat = setInterval(() => {
    try { res.write(': heartbeat\n\n'); } catch (_) { clearInterval(heartbeat); }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sse.unsubscribe(req.user._id, res);
  });
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

    const isSeller = order.items.some(i => i.seller?.toString() === String(req.user._id));
    if (!isSeller && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
