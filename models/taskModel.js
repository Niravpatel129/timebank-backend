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
    timerType: {
      type: String,
      required: false,
      default: 'countup',
    },
    listType: {
      type: String,
      default: 'currentWeek',
    },
    taskDuration: {
      type: Number,
      required: false,
      min: 0,
    },
    status: {
      type: String,
      default: 'not-started',
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    timerState: {
      isActive: {
        type: Boolean,
        default: false,
      },
      startTime: {
        type: Date,
      },
      remainingTime: {
        type: Number,
        default: 0,
      },
      timeUsed: {
        type: Number,
        default: 0,
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    dateDue: {
      type: Date,
      required: false,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
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
    taskBoardOrder: {
      type: Number,
      default: 0,
    },
    taskPriority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
