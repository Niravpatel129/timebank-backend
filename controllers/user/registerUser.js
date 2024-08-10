const User = require('../../models/userModel.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      text: `Your verification code is: ${verificationCode}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Store user data temporarily (you might want to use Redis or a similar solution for production)
    req.session.pendingUser = {
      username,
      email,
      password,
      verificationCode,
    };

    res.status(200).json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = registerUser;
