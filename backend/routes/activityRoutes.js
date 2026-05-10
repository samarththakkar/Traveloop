const express = require('express');
const router = express.Router();
const { getActivity, updateActivity, deleteActivity } = require('../controllers/activityController');

// Dummy auth middleware placeholder
const protect = (req, res, next) => next();

// Routes for specific activities (creation is handled in tripRoutes)
router.route('/:id')
  .get(protect, getActivity)
  .put(protect, updateActivity)
  .delete(protect, deleteActivity);

module.exports = router;
