const Task = require('../../models/taskModel');
const mongoose = require('mongoose');

const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user after authentication
    const { projectId } = req.params; // Get project ID from request parameters
    console.log('🚀  projectId:', projectId);

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
      });
    }

    const tasks = await Task.find({ project: projectId })
      .sort({ date: -1 })
      .populate('user', 'name email')
      .populate('assignee', 'name email'); // Populate assignee field with name and email

    const totalTimeSpent = tasks.reduce((acc, task) => acc + task.timeSpent, 0);
    console.log('🚀  totalTimeSpent:', totalTimeSpent);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks: tasks,
      totalTimeSpent,
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
