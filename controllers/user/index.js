const sendSignupVerificationEmail = require('./sendSignupVerificationEmail.js');
const isVerified = require('./isVerified.js');
const verifyEmail = require('./verifyEmail.js');
const getMe = require('./getMe.js');
module.exports = {
  sendSignupVerificationEmail,
  isVerified,
  verifyEmail,
  getMe,
};
