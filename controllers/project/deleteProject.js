const Project = require('../../models/projectModel');

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is authorized to delete the project
    // This assumes that the user ID is stored in req.user.id after authentication
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await project.remove();

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = deleteProject;
