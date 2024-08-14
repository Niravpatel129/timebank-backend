const express = require('express');
const router = express.Router();
const {
  sendSignupVerificationEmail,
  isVerified,
  verifyEmail,
  getMe,
  sendLoginCode,
  verifyLogin,
} = require('../../controllers/user');

// Get user by ID
router.post('/send-verification', sendSignupVerificationEmail);
router.post('/send-login-code', sendLoginCode);
router.get('/check-verification/:email', isVerified);
router.post('/add-verification-code', verifyEmail);
router.post('/verify-login-code', verifyLogin);

router.get('/me', getMe);

module.exports = router;
