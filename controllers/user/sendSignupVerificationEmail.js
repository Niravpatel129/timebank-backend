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

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update the verification code
      user.verificationCode = verificationCode;
      await user.save();
    } else {
      // If user doesn't exist, create a new user with pending status
      const password =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      user = new User({
        name,
        email,
        verificationCode,
        password,
        status: 'pending',
        onboardingData,
      });

      await user.save();
    }

    await sendEmail(email, 'signupVerificationEmail', {
      verificationCode,
      name,
      verificationUrl: `https://www.hourblock.com/verify-email?code=${verificationCode}`,
    });

    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error in sending verification email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = sendSignupVerificationEmail;
