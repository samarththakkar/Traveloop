const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  preferences: {
    currency: { type: String, default: 'USD' },
    notifications: { type: Boolean, default: true },
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
