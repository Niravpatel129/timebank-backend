// models/timeTrackModel.js
const mongoose = require('mongoose');

const timeTrackSchema = new mongoose.Schema(
  {
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
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const TimeTrack = mongoose.model('TimeTrack', timeTrackSchema);

module.exports = TimeTrack;
