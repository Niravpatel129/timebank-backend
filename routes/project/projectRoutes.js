const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/project/index');
const { authenticateUser } = require('../../middleware/auth');

// Create a new project
router.post('/', authenticateUser, projectController.createProject);

// Get all projects for a user
router.get('/', authenticateUser, projectController.getProjects);

// Get a specific project
router.get('/:id', authenticateUser, projectController.getProject);

// Update a project
router.put('/:id', authenticateUser, projectController.updateProject);

// Delete a project
router.delete('/:id', authenticateUser, projectController.deleteProject);

module.exports = router;
