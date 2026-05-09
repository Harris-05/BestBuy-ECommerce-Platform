const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Schema definition
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
