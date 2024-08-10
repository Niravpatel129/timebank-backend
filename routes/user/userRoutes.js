const express = require('express');
const router = express.Router();
const { sendSignupVerificationEmail, isVerified, verifyEmail } = require('../../controllers/user');

// Get user by ID
router.post('/send-verification', sendSignupVerificationEmail);
router.get('/check-verification/:email', isVerified);
router.post('/add-verification-code', verifyEmail);

module.exports = router;
