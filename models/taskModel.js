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

// Helper method to get the old value
taskSchema.methods.getOldValue = function (path) {
  return this.get(path) !== this[path] ? this[path] : undefined;
};

// Pre-update middleware
taskSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  const fieldsToTrack = ['name', 'category', 'timeSpent', 'status', 'assignee', 'dateDue'];
  const logs = [];

  fieldsToTrack.forEach((field) => {
    if (update[field] !== undefined) {
      logs.push({
        field,
        newValue: update[field],
        changedBy: update.user, // Assuming you're passing the user ID in the update
      });

      if (field === 'status') {
        this.update(
          {},
          {
            $push: {
              statusHistory: {
                status: update[field],
                changedBy: update.user,
              },
            },
          },
        );
      }
    }
  });

  if (logs.length > 0) {
    this.update({}, { $push: { changeLog: { $each: logs } } });
  }

  next();
});

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
