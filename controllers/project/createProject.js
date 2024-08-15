const Project = require('../../models/projectModel');
const inviteUserToProject = require('../../utils/inviteUserToProject');

const createProject = async (req, res) => {
  try {
    const { ...rest } = req.body;

    const invitees = rest.members.filter((member) => member.status === 'You');

    const otherMembers = rest.members.filter((member) => member.status !== 'You');

    const newProject = new Project({
      user: req.user.id,
      name: rest.name,
      members: invitees,
      creator: req.user.id,
      projectColor: rest.projectColor,
    });

    const savedProject = await newProject.save();

    // invite other members to the project
    otherMembers.forEach((member) => {
      inviteUserToProject(savedProject._id, member.email, req.user);
    });

    const populatedProject = await Project.findById(savedProject._id).populate(
      'members.user',
      'name',
    );

    // invite

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = createProject;
