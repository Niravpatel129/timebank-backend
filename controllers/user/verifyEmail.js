const User = require('../../models/userModel');

const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // find email + verification code
    const user = await User.findOne({ email, verificationCode }).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // update user emailVerified to true
    user.emailVerified = true;
    await user.save();

    res.status(201).json({ message: 'Email verified successfully', user });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = verifyEmail;
