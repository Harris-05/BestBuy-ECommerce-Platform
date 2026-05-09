const mongoose = require('mongoose');
const Product  = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products (public, with filters/pagination)
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      const cat = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
      query.category = cat ? cat._id : new mongoose.Types.ObjectId();
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'price_asc')  sortQuery = { price: 1 };
    if (sort === 'price_desc') sortQuery = { price: -1 };
    if (sort === 'rating')     sortQuery = { averageRating: -1 };

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('seller', 'name')
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name')
      .populate('seller', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current seller's products
// @route   GET /api/products/mine
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .populate('category', 'name')
      .lean();

    const result = products.map(p => ({
      ...p,
      category: p.category?.name ?? '',
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category: catName, images } = req.body;

    let cat = await Category.findOne({ name: { $regex: new RegExp(`^${catName}$`, 'i') } });
    if (!cat) {
      cat = await Category.create({ name: catName, description: `${catName} products.` });
    }

    const product = await Product.create({
      name,
      description,
      price:    Number(price),
      stock:    Number(stock),
      category: cat._id,
      images:   images?.filter(Boolean).length ? images.filter(Boolean) : ['no-photo.jpg'],
      seller:   req.user.id,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const { name, description, price, stock, category: catName, images, isActive } = req.body;

    if (catName) {
      let cat = await Category.findOne({ name: { $regex: new RegExp(`^${catName}$`, 'i') } });
      if (!cat) cat = await Category.create({ name: catName, description: `${catName} products.` });
      product.category = cat._id;
    }

    if (name        !== undefined) product.name        = name;
    if (description !== undefined) product.description = description;
    if (price       !== undefined) product.price       = Number(price);
    if (stock       !== undefined) product.stock       = Number(stock);
    if (images      !== undefined) product.images      = images.filter(Boolean).length ? images.filter(Boolean) : product.images;
    if (isActive    !== undefined) product.isActive    = isActive;

    await product.save();
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
