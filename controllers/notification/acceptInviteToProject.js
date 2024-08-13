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

    // Check if the notification is a project invitation
    if (notification.type !== 'project_invitation') {
      return res.status(400).json({ message: 'This notification is not a project invitation' });
    }

    // Find the project
    const project = await Project.findById(notification.relatedProject);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the user based on either recipient or email
    let user;
    if (notification.recipient) {
      user = await User.findById(notification.recipient);
    } else if (notification.email) {
      user = await User.findOne({ email: notification.email });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already a member of the project
    const isAlreadyMember = project.members.some(
      (member) => member.user.toString() === user._id.toString(),
    );

    if (isAlreadyMember) {
      // If already a member, just update the notification status
      notification.invitationStatus = 'accepted';
      await notification.save();
      return res.status(200).json({ message: 'You are already a member of this project' });
    }

    // Update the notification status to accepted
    notification.invitationStatus = 'accepted';
    await notification.save();

    // Add the user to the project's members
    const updatedProject = await Project.findByIdAndUpdate(
      notification.relatedProject,
      {
        $addToSet: {
          members: {
            user: user._id,
            role: { value: 'member', label: 'member' },
            email: user.email,
          },
        },
      },
      { new: true },
    );

    res
      .status(200)
      .json({ message: 'Project invitation accepted successfully', project: updatedProject });
  } catch (error) {
    console.error('Error accepting project invitation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = acceptInviteToProject;
