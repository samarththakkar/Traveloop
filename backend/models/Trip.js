const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['planning', 'upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'planning',
  },
  totalBudget: {
    type: Number,
    default: 0,
  },
  coverImage: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
