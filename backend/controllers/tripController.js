const Trip = require('../models/Trip');

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
  try {
    // Assuming req.user is set by an auth middleware
    const userId = req.user ? req.user.id : 'dummy-user-id'; 
    const trips = await Trip.find({ userId }).sort('-createdAt');
    res.status(200).json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  try {
    // Add user to req.body
    req.body.userId = req.user ? req.user.id : 'dummy-user-id';
    
    const trip = await Trip.create(req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip
};
