const Product = require('../models/Product');

// @desc    Add a review to a product
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      r => r.user?.toString() === req.user.id
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed' });
    }

    product.reviews.push({
      user:    req.user.id,
      name:    req.user.name,
      rating:  Number(rating),
      comment: comment ?? '',
    });

    product.recalcRating();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a review (seller adds reply, or user edits their own review)
// @route   PATCH /api/reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const { productId, reply, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const isSeller = product.seller.toString() === req.user.id;
    const isReviewAuthor = review.user?.toString() === req.user.id;

    if (reply !== undefined && isSeller) {
      review.reply = reply;
    } else if (isReviewAuthor) {
      if (rating  !== undefined) review.rating  = Number(rating);
      if (comment !== undefined) review.comment = comment;
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    product.recalcRating();
    await product.save();

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
