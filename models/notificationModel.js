const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['task_assigned', 'task_completed', 'project_update', 'mention', 'project_invitation'],
    },
    content: {
      type: String,
      required: true,
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    invitationStatus: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
