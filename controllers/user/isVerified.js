const User = require('../../models/userModel');

const isVerified = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ isVerified: user.emailVerified });
  } catch (error) {
    console.error('Error in isVerified:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = isVerified;
