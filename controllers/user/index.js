const sendSignupVerificationEmail = require('./sendSignupVerificationEmail.js');
const isVerified = require('./isVerified.js');
const verifyEmail = require('./verifyEmail.js');
const getMe = require('./getMe.js');
const sendLoginCode = require('./sendLoginCode.js');
const verifyLogin = require('./verifyLogin.js');

module.exports = {
  sendSignupVerificationEmail,
  isVerified,
  verifyEmail,
  getMe,
  sendLoginCode,
  verifyLogin,
};
