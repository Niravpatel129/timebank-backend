const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../../middleware/auth.js');
const { getAllTasks, createTask, deleteTask, updateTaskStatus } = require('../../controllers/task');

// Get all tasks
router.get('/', authenticateUser, getAllTasks);

// Create a new task
router.post('/', authenticateUser, createTask);

// Delete a task
router.delete('/:id', authenticateUser, deleteTask);

// Update task status
router.patch('/:id/status', authenticateUser, updateTaskStatus);

module.exports = router;
