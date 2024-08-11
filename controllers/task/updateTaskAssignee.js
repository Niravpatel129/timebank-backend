const { Task } = require('../../models/taskModel');

const updateTaskAssignee = async (req, res) => {
  const { id: taskId } = req.params;
  const { assignee } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: assignee },
      { new: true },
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error in updateTaskAssignee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = updateTaskAssignee;
