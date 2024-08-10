const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');

const verifyEmail = async (req, res) => {
  console.log('Entering verifyEmail function');
  try {
    const { email, verificationCode } = req.body;
    console.log(`Attempting to verify email: ${email} with code: ${verificationCode}`);

    const user = await User.findOne({ email, verificationCode }).select('-password');
    if (!user) {
      console.log(`No user found for email: ${email} with verification code: ${verificationCode}`);
      return res.status(400).json({ message: 'Invalid verification code', isVerified: false });
    }

    console.log(`User found: ${user._id}. Updating emailVerified status.`);
    user.emailVerified = true;
    await user.save();
    console.log(`User ${user._id} email verified successfully`);

    // Generate JWT token without expiration
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      message: 'Email verified successfully',
      isVerified: true,
      user,
      authToken,
    });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    res.status(500).json({ message: 'Server error' });
  }
  console.log('Exiting verifyEmail function');
};

module.exports = verifyEmail;
