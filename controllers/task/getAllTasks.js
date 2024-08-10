const Task = require('../../models/taskModel');

const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user after authentication

    const tasks = await Task.find({ user: userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = getAllTasks;
