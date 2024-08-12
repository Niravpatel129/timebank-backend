const Project = require('../../models/projectModel');

const createProject = async (req, res) => {
  try {
    const { ...rest } = req.body;
    console.log('🚀  rest:', rest);

    // Assuming the user ID is stored in req.user.id after authentication
    const newProject = new Project({
      user: req.user.id,
      name: rest.name,
      members: rest.members,
      creator: req.user.id,
      projectColor: rest.projectColor,
    });

    const savedProject = await newProject.save();

    // Populate the members.user field
    const populatedProject = await Project.findById(savedProject._id).populate(
      'members.user',
      'name',
    );

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = createProject;
