const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    // ... existing fields ...

    changeLog: [
      {
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    statusHistory: [
      {
        status: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    timeTrackingHistory: [
      {
        action: String, // 'start', 'pause', 'resume', 'complete'
        timestamp: {
          type: Date,
          default: Date.now,
        },
        duration: Number, // in seconds
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    comments: [
      {
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true },
);

// Pre-save middleware
taskSchema.pre('save', function (next) {
  if (this.isNew) {
    return next();
  }

  const fieldsToTrack = ['name', 'category', 'timeSpent', 'status', 'assignee', 'dateDue'];
  const modifiedPaths = this.modifiedPaths();

  fieldsToTrack.forEach((field) => {
    if (modifiedPaths.includes(field)) {
      this.changeLog.push({
        field,
        oldValue: this.getOldValue(field),
        newValue: this.get(field),
        changedBy: this.user, // Assuming 'user' field contains the current user's ID
      });

      if (field === 'status') {
        this.statusHistory.push({
          status: this.get(field),
          changedBy: this.user,
        });
      }
    }
  });

  next();
});

// ... existing helper methods and pre-update middleware ...

// Method to add a time tracking event
taskSchema.methods.addTimeTrackingEvent = function (action, duration, userId) {
  this.timeTrackingHistory.push({
    action,
    duration,
    performedBy: userId,
  });
  return this.save();
};

// Method to add a comment
taskSchema.methods.addComment = function (text, userId) {
  this.comments.push({
    text,
    createdBy: userId,
  });
  return this.save();
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
