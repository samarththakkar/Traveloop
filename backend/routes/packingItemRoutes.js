const express = require('express');
const router = express.Router();
const { togglePackingItem } = require('../controllers/packingItemController');

// Dummy auth middleware placeholder
const protect = (req, res, next) => next();

// Routes for specific packing items (creation/fetching is handled in tripRoutes)
router.route('/:id/toggle')
  .put(protect, togglePackingItem);

module.exports = router;
