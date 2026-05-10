const Accommodation = require('../models/Accommodation');

// @desc    Get all accommodations for a trip
// @route   GET /api/trips/:tripId/accommodations
// @access  Private
const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find({ tripId: req.params.tripId }).sort('checkInDate');
    res.status(200).json({ success: true, count: accommodations.length, data: accommodations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add an accommodation
// @route   POST /api/trips/:tripId/accommodations
// @access  Private
const addAccommodation = async (req, res) => {
  try {
    req.body.tripId = req.params.tripId;
    const accommodation = await Accommodation.create(req.body);
    res.status(201).json({ success: true, data: accommodation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete an accommodation
// @route   DELETE /api/accommodations/:id
// @access  Private
const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ success: false, error: 'Accommodation not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getAccommodations,
  addAccommodation,
  deleteAccommodation
};
