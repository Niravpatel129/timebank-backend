const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8004;
const updateRoutes = require('./routes/update/updateRoutes');

// Allow all origins
app.use(cors({ origin: '*' }));
app.use(express.json());

// Public API routes
app.get('/', (req, res) => {
  res.send('Welcome to our public API!');
});

app.get('/version', (req, res) => {
  res.json({ version: '1.0.0' });
});

app.use('/update', updateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Public API server running on port ${port}`);
});
