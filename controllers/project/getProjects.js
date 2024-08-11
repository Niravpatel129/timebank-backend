const Project = require('../../models/projectModel');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });

    if (!projects.length) {
      return res.status(404).json({ message: 'No projects found for this user' });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getProjects;
