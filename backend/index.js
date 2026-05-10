const express = require('express');
const cors = require('cors');

// Route files
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const activityRoutes = require('./routes/activityRoutes');
const cityRoutes = require('./routes/cityRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const packingItemRoutes = require('./routes/packingItemRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const flightRoutes = require('./routes/flightRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/packing', packingItemRoutes);

// Mount new routes both for nested trip creation and direct ID operations
app.use('/api/trips/:tripId/expenses', expenseRoutes);
app.use('/api/expenses', expenseRoutes);

app.use('/api/trips/:tripId/flights', flightRoutes);
app.use('/api/flights', flightRoutes);

app.use('/api/trips/:tripId/accommodations', accommodationRoutes);
app.use('/api/accommodations', accommodationRoutes);

// Base route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Traveloop API (Dummy Backend)' });
});

// Error handling middleware (dummy)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Commented out since this is a dummy setup and we don't have mongoose connected
/*
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

module.exports = app;
