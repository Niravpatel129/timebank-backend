const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: false,
    },
    taskDuration: {
      type: Number,
      required: false,
      min: 0,
    },
    status: {
      type: String,
      enum: ['not-started', 'inProgress', 'paused', 'completed'],
      default: 'not-started',
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
