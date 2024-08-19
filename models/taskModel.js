const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255, // Adding a max length for the task name
    },
    category: {
      type: String,
      required: false,
      maxlength: 100, // Adding a max length for the category
    },
    listOrder: {
      type: Number,
      default: 0,
      max: 1000000, // Adding a max value for list order
    },
    tagColor: {
      type: String,
      default: '#E6E6FA', // Soft purple color
      required: false,
      maxlength: 7, // Ensuring the color code doesn't exceed 7 characters
    },
    timerType: {
      type: String,
      required: false,
      default: 'countup',
    },
    listType: {
      type: String,
      default: 'currentWeek',
      maxlength: 50, // Adding a max length for list type
    },
    taskDuration: {
      type: Number,
      required: false,
      min: 0,
      max: 86400, // Max duration of 24 hours (in seconds)
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
        max: 86400, // Max remaining time of 24 hours (in seconds)
      },
      timeUsed: {
        type: Number,
        default: 0,
        max: 86400, // Max time used of 24 hours (in seconds)
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
      max: 1000000, // Adding a max value for task board order
    },
    taskPriority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10, // Setting a max priority level
    },
  },
  { timestamps: true },
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
