const express = require('express');
const router = express.Router();
const { getTrips, getTrip, createTrip, updateTrip, deleteTrip } = require('../controllers/tripController');
const { getActivities, createActivity } = require('../controllers/activityController');
const { getPackingItems, addPackingItem } = require('../controllers/packingItemController');

// Dummy auth middleware placeholder
const protect = (req, res, next) => next();

router.route('/')
  .get(protect, getTrips)
  .post(protect, createTrip);

router.route('/:id')
  .get(protect, getTrip)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

// Nested routes for a specific trip
router.route('/:tripId/activities')
  .get(protect, getActivities)
  .post(protect, createActivity);

router.route('/:tripId/packing')
  .get(protect, getPackingItems)
  .post(protect, addPackingItem);

module.exports = router;
