const Project = require('../models/projectModel');
const Notification = require('../models/notificationModel');
const User = require('../models/userModel');
const sendEmail = require('../service/sendEmail');

const inviteUserToProject = async (projectId, invitedUserEmail, invitingUser) => {
  // Check if the project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  // Check if the inviting user is a member of the project
  const isMember = project.members.some((member) => member.user.toString() === invitingUser.id);
  if (!isMember) {
    throw new Error('You are not authorized to invite users to this project');
  }

  // Check if the invited user exists
  const invitedUser = await User.findOne({ email: invitedUserEmail });
  if (!invitedUser) {
    // Send email to invited user
    sendEmail(invitedUserEmail, 'projectInvitation', {
      inviterName: invitingUser.name,
      projectName: project.name,
      invitationUrl: `${process.env.FRONTEND_URL}/project/${projectId}/invitation`,
    });
  }

  // Create a new notification
  const notification = new Notification({
    recipient: invitedUser ? invitedUser._id : invitingUser.id,
    email: invitedUser ? invitedUser.email : invitedUserEmail,
    type: 'project_invitation',
    content: `You have been invited to join the project "${project.name}"`,
    relatedProject: projectId,
    invitationStatus: 'pending',
  });

  await notification.save();

  return { message: 'Invitation sent successfully' };
};

module.exports = inviteUserToProject;
