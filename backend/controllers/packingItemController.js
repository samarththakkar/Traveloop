const PackingItem = require('../models/PackingItem');

// @desc    Get packing items for a trip
// @route   GET /api/trips/:tripId/packing
// @access  Private
const getPackingItems = async (req, res) => {
  try {
    const items = await PackingItem.find({ tripId: req.params.tripId });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add packing item
// @route   POST /api/trips/:tripId/packing
// @access  Private
const addPackingItem = async (req, res) => {
  try {
    req.body.tripId = req.params.tripId;
    const item = await PackingItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Toggle packing item status
// @route   PUT /api/packing/:id/toggle
// @access  Private
const togglePackingItem = async (req, res) => {
  try {
    const item = await PackingItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    item.isPacked = !item.isPacked;
    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getPackingItems,
  addPackingItem,
  togglePackingItem
};
