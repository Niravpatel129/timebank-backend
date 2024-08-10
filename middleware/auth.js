const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
  console.log('🚀  req:', req);
  console.log('Entering authenticateUser middleware');
  if (!process.env.JWT_SECRET) {
    console.log('JWT_SECRET is not set');
    return res.status(500).json({ message: 'Internal server error' });
  }

  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token received:', token ? 'Token present' : 'No token');

    if (!token) {
      console.log('No token provided, denying authorization');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    console.log('Verifying token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Token verified, decoded userId:', decoded.id);

    // Find user by id
    console.log('Finding user by id:', decoded.id);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('No user found for id:', decoded.id);
      return res.status(401).json({ message: 'Token is not valid' });
    }

    console.log('User found:', user._id);

    // Attach user to request object
    req.user = user;
    console.log('User attached to request object');
    next();
  } catch (error) {
    console.error('Error in authenticateUser middleware:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
  console.log('Exiting authenticateUser middleware');
};

module.exports = { authenticateUser };
