const Project = require('../../models/projectModel');

const getProjects = async (req, res) => {
  try {
    console.log('🚀  req.user._id:', req.user._id);
    const projects = await Project.find({
      members: { $elemMatch: { user: req.user._id } },
    }).populate('members.user', 'name');

    if (!projects.length) {
      console.log('🚀  no projects:', projects);
      return res.status(404).json({ message: 'No projects found for this user' });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getProjects;
