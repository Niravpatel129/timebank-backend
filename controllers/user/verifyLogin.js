const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');

const verifyLogin = async (req, res) => {
  try {
    console.log('🚀  req.body:', req.body);
    const { email, loginCode } = req.body;

    if (!email || !loginCode) {
      return res.status(400).json({ message: 'Email and login code are required' });
    }

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.loginCode !== loginCode) {
      return res.status(400).json({ message: 'Invalid login code' });
    }

    if (user.loginCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Login code has expired' });
    }

    // Clear the login code and expiration
    user.loginCode = undefined;
    user.loginCodeExpires = undefined;
    await user.save();

    // Generate JWT token without expiration
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: 'Login successful',
      user: user,
      authToken: authToken,
    });
  } catch (error) {
    console.error('Error in verifyLogin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = verifyLogin;
