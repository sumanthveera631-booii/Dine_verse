const express = require('express');
const router = express.Router();
const {
  getReviews,
  getAllReviews,
  createReview,
  updateReviewStatus,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public reviews
router.get('/', getReviews);

// Authenticated customer reviews
router.post('/', protect, createReview);

// Admin review boards moderation
router.get('/all', protect, restrictTo('admin'), getAllReviews);
router.patch('/:id/status', protect, restrictTo('admin'), updateReviewStatus);

module.exports = router;
