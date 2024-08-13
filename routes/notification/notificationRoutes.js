const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../../middleware/auth');
const notificationController = require('../../controllers/notification');

// Get all notifications for the authenticated user
router.post('/project-invitation', authenticateUser, notificationController.handleInviteToProject);

module.exports = router;
