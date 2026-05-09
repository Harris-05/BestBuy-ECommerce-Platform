const express = require('express');
const {
  getProducts, getProductBySlug, getMyProducts,
  createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public
router.get('/', getProducts);

// Seller-only (must be before /:slug to avoid route conflict)
router.get('/mine', protect, authorize('seller', 'admin'), getMyProducts);

// Seller / Admin CRUD
router.post('/', protect, authorize('seller', 'admin'), createProduct);
router.put('/:id',    protect, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

// Public (last — param route catches anything else)
router.get('/:slug', getProductBySlug);

module.exports = router;
