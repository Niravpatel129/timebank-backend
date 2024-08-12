const TaskActivity = require('../../models/taskActivityModel');
const Task = require('../../models/taskModel');

const createTaskActivity = async (req, res) => {
  try {
    const { taskId, activityType, description } = req.body;

    // Validate input
    if (!taskId || !activityType) {
      return res.status(400).json({ message: 'Task ID and activity type are required' });
    }

    // Create new task activity
    const newTaskActivity = new TaskActivity({
      taskId,
      activityType,
      description,
      createdBy: req.user.id, // Assuming user is authenticated and available in req.user
    });

    // Save the task activity
    const savedTaskActivity = await newTaskActivity.save();

    // Update the task's lastActivity
    await Task.findByIdAndUpdate(taskId, { lastActivity: savedTaskActivity._id });

    res.status(201).json(savedTaskActivity);
  } catch (error) {
    console.error('Error creating task activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = createTaskActivity;
