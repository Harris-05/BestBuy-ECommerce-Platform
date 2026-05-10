const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image:    { type: String, default: '' },
  seller:   { type: mongoose.Schema.ObjectId, ref: 'User' },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [OrderItemSchema],
  shippingAddress: {
    address:       { type: String, default: '' },
    city:          { type: String, default: '' },
    postalCode:    { type: String, default: '' },
    country:       { type: String, default: '' },
    name:          { type: String, default: '' },
    phone:         { type: String, default: '' },
  },
  paymentMethod: {
    type: String,
    enum: ['Stripe', 'COD'],
    default: 'COD',
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
  isPaid:      { type: Boolean, default: false },
  paidAt:      { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
