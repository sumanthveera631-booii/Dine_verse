const Review = require('../models/Review');

// @desc    Get all approved reviews (Public)
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for moderation (Admin only)
// @route   GET /api/reviews/all
// @access  Private/Admin
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  const { comments, ratingValue } = req.body;
  try {
    const review = await Review.create({
      user: req.user._id,
      name: req.user.name,
      comments,
      ratingValue: Number(ratingValue),
      status: 'Approved', // Auto-approved on submission, can be flagged by admin
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review status (Admin only)
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
exports.updateReviewStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Critique review not found' });
    }

    review.status = status;
    await review.save();

    const populated = await Review.findById(review._id).populate('user', 'name email');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
