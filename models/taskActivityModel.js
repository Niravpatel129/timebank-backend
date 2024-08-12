const mongoose = require('mongoose');

const taskActivitySchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    activityType: {
      type: String,
      enum: ['started', 'paused', 'resumed', 'finished', 'break_started', 'break_ended'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number,
      default: 0,
    },
    remainingTime: {
      type: Number,
      default: 0,
    },
    mood: {
      type: String,
      enum: ['productive', 'neutral', 'distracted'],
    },
  },
  { timestamps: true },
);

taskActivitySchema.index({ task: 1, user: 1, project: 1, activityType: 1, timestamp: -1 });

const TaskActivity = mongoose.model('TaskActivity', taskActivitySchema);

module.exports = TaskActivity;
