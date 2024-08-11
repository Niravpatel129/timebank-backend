const Project = require('../../models/projectModel');

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Assuming the user ID is stored in req.user.id after authentication
    const newProject = new Project({
      name,
      description,
      user: req.user.id,
    });

    const savedProject = await newProject.save();

    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = createProject;
