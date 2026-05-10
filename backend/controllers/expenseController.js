const Expense = require('../models/Expense');

// @desc    Get all expenses for a trip
// @route   GET /api/trips/:tripId/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.params.tripId }).sort('-date');
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add an expense
// @route   POST /api/trips/:tripId/expenses
// @access  Private
const addExpense = async (req, res) => {
  try {
    req.body.tripId = req.params.tripId;
    req.body.userId = req.user ? req.user.id : 'dummy-user-id';
    
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  deleteExpense
};
