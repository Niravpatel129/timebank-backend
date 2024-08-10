const getUser = require('./getUser');
const registerUser = require('./registerUser.js');
const sendSignupVerificationEmail = require('./sendSignupVerificationEmail.js');
const isVerified = require('./isVerified.js');
const verifyEmail = require('./verifyEmail.js');
module.exports = {
  getUser,
  registerUser,
  sendSignupVerificationEmail,
  isVerified,
  verifyEmail,
};
