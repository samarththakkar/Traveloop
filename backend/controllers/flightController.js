const Flight = require('../models/Flight');

// @desc    Get all flights for a trip
// @route   GET /api/trips/:tripId/flights
// @access  Private
const getFlights = async (req, res) => {
  try {
    const flights = await Flight.find({ tripId: req.params.tripId }).sort('departureTime');
    res.status(200).json({ success: true, count: flights.length, data: flights });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add a flight
// @route   POST /api/trips/:tripId/flights
// @access  Private
const addFlight = async (req, res) => {
  try {
    req.body.tripId = req.params.tripId;
    const flight = await Flight.create(req.body);
    res.status(201).json({ success: true, data: flight });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a flight
// @route   DELETE /api/flights/:id
// @access  Private
const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, error: 'Flight not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getFlights,
  addFlight,
  deleteFlight
};
