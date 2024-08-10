const express = require('express');
const router = express.Router();
const { getUser, registerUser, sendSignupVerificationEmail } = require('../../controllers/user');

// Get user by ID
router.get('/:id', getUser);
router.post('/register', registerUser);
router.post('/send-verification', sendSignupVerificationEmail);

module.exports = router;
