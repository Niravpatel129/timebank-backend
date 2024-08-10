const express = require('express');
const router = express.Router();
const { getUser } = require('../../controllers/user');

// Get user by ID
router.get('/:id', getUser);
router.post('/register', registerUser);

module.exports = router;
