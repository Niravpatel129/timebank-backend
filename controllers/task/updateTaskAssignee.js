const Task = require('../../models/taskModel');

const updateTaskAssignee = async (req, res) => {
  const { id: taskId } = req.params;
  const { assignee } = req.body;

  console.log('Updating task assignee:', { taskId, assignee });

  try {
    const updateData = assignee === null ? { $unset: { assignee: 1 } } : { assignee };

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true })
      .populate('user', 'name email')
      .populate('assignee', 'name email');

    console.log('🚀  updatedTask:', updatedTask);

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error in updateTaskAssignee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = updateTaskAssignee;
