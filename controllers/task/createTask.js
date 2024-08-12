const Task = require('../../models/taskModel');

const createTask = async (req, res) => {
  try {
    const { name, category, taskDuration, status, date, dateDue, project, assignee } = req.body;
    if (!project) {
      return res.status(400).json({ message: 'Project is required' });
    }
    const userId = req.user.id; // Assuming user ID is available in req.user after authentication
    const initalTaskDuration = taskDuration;

    const newTask = new Task({
      name,
      category,
      taskDuration,
      status,
      date,
      dateDue,
      project,
      user: userId,
      assignee: assignee,
      timerState: {
        startTime: null,
        remainingTime: initalTaskDuration,
        isPaused: false,
      },
    });

    const savedTask = await newTask.save();

    // Populate the assignee field
    await savedTask.populate('assignee', 'name email');

    res.status(201).json({
      success: true,
      task: savedTask,
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
