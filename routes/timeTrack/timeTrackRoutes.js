const express = require('express');
const router = express.Router();
const { getLastTwoMonthsTimeTrack } = require('../../controllers/timeTrack');
const { authenticateUser } = require('../../middleware/auth');

// Route to get time track data for the last two months
router.get('/last-two-months', authenticateUser, getLastTwoMonthsTimeTrack);

module.exports = router;
