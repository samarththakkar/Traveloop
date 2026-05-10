const express = require('express');
const router = express.Router();
const { getCities, getCity, createCity } = require('../controllers/cityController');

// Dummy auth middleware placeholder
const protect = (req, res, next) => next();
const admin = (req, res, next) => next();

router.route('/')
  .get(getCities)
  .post(protect, admin, createCity);

router.route('/:id')
  .get(getCity);

module.exports = router;
