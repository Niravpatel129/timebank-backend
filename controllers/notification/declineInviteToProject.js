const Notification = require('../../models/notificationModel');
const Project = require('../../models/projectModel');

const declineInviteToProject = async (req, res) => {
  try {
    console.log('declineInviteToProject');
    const { notificationId } = req.body;
    const userId = req.user._id;

    // Find the notification
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      console.log('Notification not found');
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if the notification is for the current user
    if (notification.recipient.toString() !== userId.toString()) {
      console.log('You are not authorized to decline this invitation');
      return res.status(403).json({ message: 'You are not authorized to decline this invitation' });
    }

    // Check if the notification is a project invitation
    if (notification.type !== 'project_invitation') {
      console.log('This notification is not a project invitation');
      return res.status(400).json({ message: 'This notification is not a project invitation' });
    }

    // Check if the invitation is still pending
    if (notification.invitationStatus !== 'pending') {
      console.log('This invitation has already been processed');
      return res.status(400).json({ message: 'This invitation has already been processed' });
    }

    // Update the notification status to declined
    notification.invitationStatus = 'declined';
    await notification.save();

    // Remove the user from the project's pendingMembers if they exist
    await Project.findByIdAndUpdate(notification.relatedProject, {
      $pull: { pendingMembers: userId },
    });

    console.log('Project invitation declined successfully');
    res.status(200).json({ message: 'Project invitation declined successfully' });
  } catch (error) {
    console.error('Error declining project invitation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = declineInviteToProject;
