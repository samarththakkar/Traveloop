const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: String,
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  bookingReference: String,
  type: {
    type: String,
    enum: ['Hotel', 'Hostel', 'Airbnb', 'Resort', 'Other'],
    default: 'Hotel'
  },
  costPerNight: Number,
  totalCost: Number,
}, { timestamps: true });

module.exports = mongoose.model('Accommodation', accommodationSchema);
