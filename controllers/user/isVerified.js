const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');

const isVerified = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let response = { isVerified: user.emailVerified };

    if (user.emailVerified) {
      const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      response.user = { ...user, authToken };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in isVerified:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = isVerified;
