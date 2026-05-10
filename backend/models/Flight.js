const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  flightNumber: {
    type: String,
    required: true,
  },
  departureAirport: {
    type: String,
    required: true,
  },
  arrivalAirport: {
    type: String,
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  bookingReference: String,
  cost: Number,
}, { timestamps: true });

module.exports = mongoose.model('Flight', flightSchema);
