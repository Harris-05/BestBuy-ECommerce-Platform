const express = require('express');
const { createReview, updateReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/',       protect, createReview);
router.patch('/:id',   protect, updateReview);

module.exports = router;
