const express = require('express');
const router = express.Router();
const {
  getUser,
  registerUser,
  sendSignupVerificationEmail,
  isVerified,
} = require('../../controllers/user');

// Get user by ID
router.get('/:id', getUser);
router.post('/register', registerUser);
router.post('/send-verification', sendSignupVerificationEmail);
router.get('/check-verification/:email', isVerified);

module.exports = router;
