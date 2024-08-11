const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      },
      gradient2: {
        type: String,
        match: /^#[0-9A-Fa-f]{6}$/,
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
