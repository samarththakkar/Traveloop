const express = require('express');
const router = express.Router({ mergeParams: true });
const { getAccommodations, addAccommodation, deleteAccommodation } = require('../controllers/accommodationController');

// Dummy auth middleware placeholder
const protect = (req, res, next) => next();

router.route('/')
  .get(protect, getAccommodations)
  .post(protect, addAccommodation);

router.route('/:id')
  .delete(protect, deleteAccommodation);

module.exports = router;
