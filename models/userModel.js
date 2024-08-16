const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 255, // Adding max length for email
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    maxlength: 100, // Adding max length for name
  },
  password: {
    type: String,
    required: true,
    maxlength: 128, // Adding max length for password (hashed)
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    maxlength: 64, // Adding max length for verification code
  },
  onboardingData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  status: {
    type: String,
    maxlength: 50, // Adding max length for status
  },
  defaultProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  loginCode: {
    type: String,
    maxlength: 64, // Adding max length for login code
  },
  loginCodeExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
