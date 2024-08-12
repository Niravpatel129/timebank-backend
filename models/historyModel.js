const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  entityType: {
    type: String,
    enum: ['Task', 'Project'],
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  entityName: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: Object,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Virtual property for formatted time difference
historySchema.virtual('timeAgo').get(function () {
  const now = new Date();
  const diff = now - this.timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
});

// Method to generate log message
historySchema.methods.generateLogMessage = function () {
  return `${this.entityName} ${this.action} ${this.timeAgo}`;
};

const History = mongoose.model('History', historySchema);

module.exports = History;
