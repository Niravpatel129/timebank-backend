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
  pauseTaskTimer,
  resumeTaskTimer,
  finishTask,
} = require('../../controllers/task');

// Get all tasks
router.get('/:projectId', authenticateUser, getAllTasks);

// Create a new task
router.post('/', authenticateUser, createTask);

// Delete a task
router.delete('/:id', authenticateUser, deleteTask);

// Update task status
router.patch('/:id/status', authenticateUser, updateTaskStatus);

// Update task
router.put('/:id', authenticateUser, updateTask);

// Start task timer
router.post('/:id/start', authenticateUser, startTaskTimer);

// Pause task timer
router.post('/:id/pause', authenticateUser, pauseTaskTimer);

// Resume task timer
router.post('/:id/resume', authenticateUser, resumeTaskTimer);

// Finish task
router.post('/:id/finish', authenticateUser, finishTask);

module.exports = router;
