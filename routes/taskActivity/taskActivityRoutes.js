const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../../middleware/auth');
const {
  createTaskActivity,
  getTaskActivities,
  getTaskActivityMetrics,
} = require('../../controllers/taskActivity');

// Create a new task activity
router.post('/', authenticateUser, createTaskActivity);

// Get task activities for a specific task
router.get('/task/:taskId', authenticateUser, getTaskActivities);

// Get task activity metrics for a specific task
router.get('/metrics/:taskId', authenticateUser, getTaskActivityMetrics);

module.exports = router;
