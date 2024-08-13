const Project = require('../../models/projectModel');
const Notification = require('../../models/notificationModel');
const User = require('../../models/userModel');

const handleInviteToProject = async (req, res) => {
  try {
    console.log('handleInviteToProject');
    const { projectId, invitedUserEmail } = req.body;
    const invitingUserId = req.user.id;

    // Check if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the inviting user is a member of the project
    const isMember = project.members.some((member) => member.user.toString() === invitingUserId);
    if (!isMember) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to invite users to this project' });
    }

    // Check if the invited user exists
    const invitedUser = await User.findOne({ email: invitedUserEmail });
    if (!invitedUser) {
      return res.status(404).json({ message: 'Invited user not found' });
    }

    // Check if the user is already a member of the project
    const isAlreadyMember = project.members.some(
      (member) => member.user.toString() === invitedUser._id.toString(),
    );
    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    // Create a new notification
    const notification = new Notification({
      recipient: invitedUser._id,
      type: 'project_invitation',
      content: `You have been invited to join the project "${project.name}"`,
      relatedProject: projectId,
      invitationStatus: 'pending',
    });

    await notification.save();

    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Error handling project invitation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = handleInviteToProject;
