const inviteUserToProject = require('../../utils/inviteUserToProject');

const handleInviteToProject = async (req, res) => {
  try {
    console.log('handleInviteToProject');
    const { projectId, invitedUserEmail } = req.body;

    const result = await inviteUserToProject(projectId, invitedUserEmail, req.user);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error handling project invitation:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

module.exports = handleInviteToProject;
