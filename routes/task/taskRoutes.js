const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../../middleware/auth.js');
const {
  getAllTasks,
  createTask,
  deleteTask,
  updateTaskStatus,
  updateTask,
  startTaskTimer,
  stopTaskTimer,
} = require('../../controllers/task');

// Get all tasks
router.get('/', authenticateUser, getAllTasks);

// Create a new task
router.post('/', authenticateUser, createTask);

// Delete a task
router.delete('/:id', authenticateUser, deleteTask);

// Update task status
router.patch('/:id/status', authenticateUser, updateTaskStatus);

// update task
router.put('/:id', authenticateUser, updateTask);

// start task timer
router.post('/:id/start', authenticateUser, startTaskTimer);

// stop task timer
router.post('/:id/stop', authenticateUser, stopTaskTimer);

module.exports = router;
