const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8004;
const mongoose = require('mongoose');
require('dotenv').config();

// Allow all origins
app.use(cors({ origin: '*' }));
app.use(express.json());

// app use userRoutes
app.use('/api/user', require('./routes/user/userRoutes'));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Public API routes
app.get('/', (req, res) => {
  res.send('Welcome to our public API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Public API server running on port ${port}`);
});
