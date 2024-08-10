const User = require('../../models/userModel');

const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email, verificationCode }).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code', isVerified: false });
    }

    user.emailVerified = true;
    await user.save();

    res.status(201).json({ message: 'Email verified successfully', isVerified: true, user });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = verifyEmail;
