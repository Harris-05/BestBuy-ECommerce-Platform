const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.ObjectId, ref: 'User' },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  reply:   { type: String, default: '' },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters'],
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description can not be more than 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0,
  },
  images: {
    type: [String],
    default: ['no-photo.jpg'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true,
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  averageRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  reviews: [ReviewSchema],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

ProductSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
  next();
});

ProductSchema.methods.recalcRating = function () {
  if (!this.reviews.length) { this.averageRating = undefined; return; }
  this.averageRating = this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length;
};

module.exports = mongoose.model('Product', ProductSchema);
