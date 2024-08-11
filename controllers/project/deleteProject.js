const Project = require('../../models/projectModel');

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete project with id: ${id}`);

    const project = await Project.findById(id);

    if (!project) {
      console.log(`Project with id ${id} not found`);
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log(`Project found: ${project._id}`);

    // Check if the user is authorized to delete the project
    // This assumes that the user ID is stored in req.user.id after authentication
    if (!req.user || !req.user.id) {
      console.log('User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!project.creator || project.creator.toString() !== req.user.id) {
      console.log(`User ${req.user.id} not authorized to delete project ${project._id}`);
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Project.findByIdAndDelete(id);
    console.log(`Project ${project._id} deleted successfully`);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = deleteProject;
