const express = require('express');
const router = express.Router();
const historyController = require('../../controllers/history');
const { authenticateUser } = require('../../middleware/auth.js');

router.post('/add', authenticateUser, historyController.addHistory);
router.get('/project/:projectId', authenticateUser, historyController.getProjectHistory);

// router.get('/:entityType/:entityId', authenticateUser, historyController.getEntityHistory);

module.exports = router;
