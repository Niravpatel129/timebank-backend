const Project = require('../../models/projectModel');

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    let project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is authorized to update the project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    project.name = name || project.name;
    project.description = description || project.description;

    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = updateProject;
