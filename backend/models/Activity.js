const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'adventure', 'culture', 'shopping', 'transport', 'accommodation'],
    required: true,
  },
  description: String,
  date: Date,
  time: String,
  estimatedCost: {
    type: Number,
    default: 0,
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  isCompleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
