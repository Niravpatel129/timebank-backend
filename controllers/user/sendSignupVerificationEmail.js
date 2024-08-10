const User = require('../../models/userModel.js');
const bcrypt = require('bcrypt');
const sendEmail = require('../../service/sendEmail.js');

const sendSignupVerificationEmail = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with emailVerified set to false
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      emailVerified: false,
    });

    // Save the user to the database
    await newUser.save();

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the verification code in the session
    req.session.signupVerificationCode = verificationCode;
    req.session.signupEmail = email;

    await sendEmail(email, 'signupVerificationEmail', { verificationCode });

    res.status(201).json({ message: 'User created and verification email sent successfully' });
  } catch (error) {
    console.error('Error in user creation and sending verification email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = sendSignupVerificationEmail;
