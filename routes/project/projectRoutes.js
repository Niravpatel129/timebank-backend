const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/project');
const { authenticateUser } = require('../../middleware/auth');

router.get('/metrics/:id', authenticateUser, projectController.getProjectMetrics);

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

// Get project metrics

module.exports = router;
