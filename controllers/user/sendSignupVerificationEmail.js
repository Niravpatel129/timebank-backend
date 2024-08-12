const Project = require('../../models/projectModel.js');
const User = require('../../models/userModel.js');
const sendEmail = require('../../service/sendEmail.js');

const sendSignupVerificationEmail = async (req, res) => {
  console.log('Entering sendSignupVerificationEmail function');
  try {
    const { name, email, onboardingData } = req.body;
    console.log(`Received request for: name=${name}, email=${email}`);

    // if name or email is missing, return 400
    if (!name || !email) {
      console.log('Missing name or email in request');
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`Generated verification code: ${verificationCode}`);

    // Check if user already exists
    let user = await User.findOne({ email });
    console.log(`User exists: ${!!user}`);

    if (user) {
      // If user exists, update the verification code
      console.log('Updating existing user with new verification code');
      user.verificationCode = verificationCode;
      await user.save();
    } else {
      // If user doesn't exist, create a new user with pending status
      console.log('Creating new user with pending status');
      const password =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      user = new User({
        name,
        email,
        verificationCode,
        password,
        status: 'pending',
        onboardingData,
      });

      const defaultProject = new Project({
        user: user._id,
        name: `${user.name}'s Project`,
        members: [{ user: user._id, role: 'owner' }],
        owner: user._id,
        creator: user._id,
        projectColor: { gradient1: '#FFCC00', gradient2: '#FF9900' },
      });

      user.defaultProject = defaultProject._id;

      await defaultProject.save();
      await user.save();
    }

    console.log('Sending verification email');
    await sendEmail(email, 'signupVerificationEmail', {
      verificationCode,
      name,
      verificationUrl: `https://www.hourblock.com/verify-email?code=${verificationCode}`,
    });

    console.log('Verification email sent successfully');
    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error in sending verification email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = sendSignupVerificationEmail;
