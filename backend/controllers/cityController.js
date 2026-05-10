const City = require('../models/City');

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
const getCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json({ success: true, count: cities.length, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single city
// @route   GET /api/cities/:id
// @access  Public
const getCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new city
// @route   POST /api/cities
// @access  Private/Admin
const createCity = async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json({ success: true, data: city });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getCities,
  getCity,
  createCity
};
