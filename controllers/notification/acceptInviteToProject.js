const Notification = require('../../models/notificationModel');
const Project = require('../../models/projectModel');
const User = require('../../models/userModel');

const acceptInviteToProject = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user._id;

    // Find the notification
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if the notification is for the current user
    if (notification.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to accept this invitation' });
    }

    // Check if the notification is a project invitation
    if (notification.type !== 'project_invitation') {
      return res.status(400).json({ message: 'This notification is not a project invitation' });
    }

    // Check if the invitation is still pending
    if (notification.invitationStatus !== 'pending') {
      return res.status(400).json({ message: 'This invitation has already been processed' });
    }

    // Update the notification status to accepted
    notification.invitationStatus = 'accepted';
    await notification.save();

    // Add the user to the project's members and remove from pendingMembers
    const project = await Project.findByIdAndUpdate(
      notification.relatedProject,
      {
        $addToSet: { members: userId },
        $pull: { pendingMembers: userId },
      },
      { new: true },
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Add the project to the user's projects
    await User.findByIdAndUpdate(userId, { $addToSet: { projects: project._id } });

    res.status(200).json({ message: 'Project invitation accepted successfully', project });
  } catch (error) {
    console.error('Error accepting project invitation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = acceptInviteToProject;
