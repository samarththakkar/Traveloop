const express = require('express');
const router = express.Router({ mergeParams: true });
const { getExpenses, addExpense, deleteExpense } = require('../controllers/expenseController');

// Dummy auth middleware placeholder
const protect = (req, res, next) => next();

// Routes nested under /api/trips/:tripId/expenses
router.route('/')
  .get(protect, getExpenses)
  .post(protect, addExpense);

// For operations directly on the expense ID (would ideally be mounted at /api/expenses/:id)
// but for simplicity in this dummy setup, we can mount it here or separate it.
// Let's assume it's mounted at /api/expenses in index.js for the delete route.
router.route('/:id')
  .delete(protect, deleteExpense);

module.exports = router;
