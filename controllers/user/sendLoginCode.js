const User = require('../../models/userModel');
const sendEmail = require('../../service/sendEmail');

const sendLoginCode = async (req, res) => {
  try {
    const {
      email: { email },
    } = req.body;
    console.log('🚀  email:', email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const loginCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.loginCode = loginCode;
    user.loginCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(email, 'loginCodeEmail', {
      loginCode,
      name: user.name,
      loginUrl: `https://www.hourblock.com/login?code=${loginCode}`,
    });

    res.status(200).json({ message: 'Login code sent successfully' });
  } catch (error) {
    console.error('Error in sending login code:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = sendLoginCode;
