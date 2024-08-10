const Task = require('../../models/taskModel');

const createTask = async (req, res) => {
  try {
    const { name, category, taskDuration, status, date } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user after authentication

    const newTask = new Task({
      name,
      category,
      taskDuration,
      status,
      date,
      user: userId,
      timerState: {
        startTime: null,
        remainingTime: taskDuration,
        isPaused: false,
      },
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      data: savedTask,
      message: 'Task created successfully',
    });
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = createTask;
