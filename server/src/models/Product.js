const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // Schema definition
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
