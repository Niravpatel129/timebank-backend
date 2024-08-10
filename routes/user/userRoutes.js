const express = require('express');
const router = express.Router();
const {
  getUser,
  registerUser,
  sendSignupVerificationEmail,
  isVerified,
  verifyEmail,
} = require('../../controllers/user');

// Get user by ID
router.get('/:id', getUser);
router.post('/register', registerUser);
router.post('/send-verification', sendSignupVerificationEmail);
router.get('/check-verification/:email', isVerified);
router.post('/add-verification-code', verifyEmail);

module.exports = router;
