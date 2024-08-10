const User = require('../../models/userModel');

const isVerified = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ isVerified: user.emailVerified, user: user.emailVerified ? user : null });
  } catch (error) {
    console.error('Error in isVerified:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = isVerified;
