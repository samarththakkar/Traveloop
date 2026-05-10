const Activity = require('../models/Activity');

// @desc    Get all activities for a trip
// @route   GET /api/trips/:tripId/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ tripId: req.params.tripId }).sort('date');
    res.status(200).json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }
    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add activity to trip
// @route   POST /api/trips/:tripId/activities
// @access  Private
const createActivity = async (req, res) => {
  try {
    req.body.tripId = req.params.tripId;
    const activity = await Activity.create(req.body);
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }
    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity
};
