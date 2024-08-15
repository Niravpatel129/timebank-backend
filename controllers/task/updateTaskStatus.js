const Task = require('../../models/taskModel');

const updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;

    const task = await Task.findOne({ _id: taskId })
      .populate('user', 'name email')
      .populate('assignee', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        task: task,
        message: 'Task not found or you do not have permission to update this task',
      });
    }

    task.status = status;
    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Task status updated successfully',
    });
  } catch (error) {
    console.error('Error in updateTaskStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = updateTaskStatus;
