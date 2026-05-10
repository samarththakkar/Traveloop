const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  region: {
    type: String,
    enum: ['Asia', 'Europe', 'Americas', 'Middle East', 'Africa', 'Oceania'],
  },
  description: String,
  coverImage: String,
  popularFor: [String],
  budgetLevel: {
    type: Number,
    min: 1,
    max: 3,
  },
  averageRating: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
