const Project = require('../../models/projectModel');

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(`Attempting to update project with id: ${id}`);
    console.log('Update data:', data);

    let project = await Project.findById(id);

    if (!project) {
      console.log(`Project with id ${id} not found`);
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log(`Project found: ${project._id}`);

    // Check if the user is authorized to update the project
    if (project.creator && project.creator.toString() !== req.user.id) {
      console.log(`User ${req.user.id} not authorized to update project ${project._id}`);
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update project with new data
    Object.assign(project, data);
    console.log('Project after update:', project);

    const updatedProject = await project.save();
    console.log(`Project ${updatedProject._id} updated successfully`);

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = updateProject;
