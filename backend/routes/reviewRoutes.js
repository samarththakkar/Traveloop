const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for nested routes
const { getReviews, addReview } = require('../controllers/reviewController');

// Dummy auth middleware placeholder
const protect = (req, res, next) => next();

router.route('/:entityType/:entityId')
  .get(getReviews);

router.route('/')
  .post(protect, addReview);

module.exports = router;
