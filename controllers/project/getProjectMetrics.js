const Project = require('../../models/projectModel');
const Task = require('../../models/taskModel');

const getProjectMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is authorized to view the project metrics
    if (project.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const tasks = await Task.find({ project: id })
      .populate('changeLog.changedBy', 'name')
      .populate('statusHistory.changedBy', 'name')
      .populate('timeTrackingHistory.performedBy', 'name')
      .populate('comments.createdBy', 'name');

    const logs = tasks.map((task) => {
      const totalTime = task.timeTrackingHistory.reduce(
        (sum, event) => sum + (event.action !== 'pause' ? event.duration : 0),
        0,
      );
      const hours = Math.floor(totalTime / 3600);
      const minutes = Math.floor((totalTime % 3600) / 60);
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;

      return {
        task: task.name,
        category: task.status === 'in_progress' ? 'Current Week' : 'Things to do',
        time: timeString,
        changeLog: task.changeLog,
        statusHistory: task.statusHistory,
        timeTrackingHistory: task.timeTrackingHistory,
        comments: task.comments,
      };
    });

    res.status(200).json({ logs });
  } catch (error) {
    console.error('Error in getProjectMetrics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getProjectMetrics;
