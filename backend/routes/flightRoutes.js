const express = require('express');
const router = express.Router({ mergeParams: true });
const { getFlights, addFlight, deleteFlight } = require('../controllers/flightController');

// Dummy auth middleware placeholder
const protect = (req, res, next) => next();

router.route('/')
  .get(protect, getFlights)
  .post(protect, addFlight);

router.route('/:id')
  .delete(protect, deleteFlight);

module.exports = router;
