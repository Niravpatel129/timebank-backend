const getUser = require('./getUser');
const registerUser = require('./registerUser.js');
const sendSignupVerificationEmail = require('./sendSignupVerificationEmail.js');
const isVerified = require('./isVerified.js');

module.exports = {
  getUser,
  registerUser,
  sendSignupVerificationEmail,
  isVerified,
};
