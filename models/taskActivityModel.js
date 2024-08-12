// taskActivityModel.js

const mongoose = require('mongoose');

const taskActivitySchema = new mongoose.Schema(
  {
    activityType: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    startCount: {
      type: Number,
      default: 0,
    },
    pauseCount: {
      type: Number,
      default: 0,
    },
    resumeCount: {
      type: Number,
      default: 0,
    },
    completionCount: {
      type: Number,
      default: 0,
    },
    breakCount: {
      type: Number,
      default: 0,
    },
    lastStartTime: Date,
    lastPauseTime: Date,
    lastResumeTime: Date,
    lastCompletionTime: Date,
    totalTimeSpent: {
      type: Number,
      default: 0,
    },
    avgSessionDuration: Number,
    totalBreakTime: {
      type: Number,
      default: 0,
    },
    avgBreakDuration: Number,
    sessionHistory: [
      {
        startTime: Date,
        endTime: Date,
        duration: Number,
      },
    ],
    breakHistory: [
      {
        startTime: Date,
        endTime: Date,
        duration: Number,
      },
    ],
  },
  { timestamps: true },
);

const TaskActivity = mongoose.model('TaskActivity', taskActivitySchema);

module.exports = TaskActivity;
