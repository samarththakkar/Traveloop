const Review = require('../models/Review');

// @desc    Get reviews for an entity
// @route   GET /api/reviews/:entityType/:entityId
// @access  Public
const getReviews = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const reviews = await Review.find({ entityType, entityId }).populate('userId', 'firstName lastName');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    req.body.userId = req.user ? req.user.id : 'dummy-user-id';
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getReviews,
  addReview
};
