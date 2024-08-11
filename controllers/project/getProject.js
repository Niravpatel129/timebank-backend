const Project = require('../../models/projectModel');

const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is authorized to view the project
    // This assumes that the user ID is stored in req.user.id after authentication
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error in getProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getProject;
