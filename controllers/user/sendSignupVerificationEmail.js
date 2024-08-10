const User = require('../../models/userModel.js');
const sendEmail = require('../../service/sendEmail.js');

const sendSignupVerificationEmail = async (req, res) => {
  try {
    const { name, email, onboardingData } = req.body;

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    await sendEmail(email, 'signupVerificationEmail', {
      verificationCode,
      name,
      verificationUrl: `https://www.hourblock.com/verify-email?code=${verificationCode}`,
    });

    res.status(201).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error in sending verification email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = sendSignupVerificationEmail;
