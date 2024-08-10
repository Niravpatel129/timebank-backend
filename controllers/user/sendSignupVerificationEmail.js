const User = require('../../models/userModel.js');
const sendEmail = require('../../service/sendEmail.js');

const sendSignupVerificationEmail = async (req, res) => {
  try {
    const { name, email, onboardingData } = req.body;

    // if name or email is missing, return 400
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Create a new user with pending status
    const newUser = new User({
      name,
      email,
      verificationCode,
      status: 'pending',
      onboardingData,
    });

    // Save the user to the database
    await newUser.save();

    await sendEmail(email, 'signupVerificationEmail', {
      verificationCode,
      name,
      verificationUrl: `https://www.hourblock.com/verify-email?code=${verificationCode}`,
    });

    res.status(201).json({ message: 'User created and verification email sent successfully' });
  } catch (error) {
    console.error('Error in creating user and sending verification email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = sendSignupVerificationEmail;
