const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  // Schema definition
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
