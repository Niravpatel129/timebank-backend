const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255, // Adding a max length for the project name
    },

    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },

    projectColor: {
      gradient1: {
        type: String,
        match: /^#[0-9A-Fa-f]{6}$/,
        maxlength: 7, // Ensuring the color code doesn't exceed 7 characters
      },
      gradient2: {
        type: String,
        match: /^#[0-9A-Fa-f]{6}$/,
        maxlength: 7, // Ensuring the color code doesn't exceed 7 characters
      },
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: mongoose.Schema.Types.Mixed,
          default: { value: 'member', label: 'member' },
        },
        email: {
          type: String,
          required: false,
          maxlength: 255, // Adding a max length for the email
        },
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
