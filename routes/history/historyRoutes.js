const express = require('express');
const router = express.Router();
const historyController = require('../../controllers/history');
const { authenticateUser } = require('../../middleware/auth.js');

router.post('/add', authenticateUser, historyController.addHistory);

module.exports = router;
