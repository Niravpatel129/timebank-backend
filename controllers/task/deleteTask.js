const Task = require('../../models/taskModel');

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id; // Assuming user ID is available in req.user after authentication

    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to delete this task',
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = deleteTask;
