const Task = require('../../models/taskModel');
const Project = require('../../models/projectModel');

const createTask = async (req, res) => {
  try {
    const { name, category, taskDuration, status, date, dateDue, project, assignee, timerType } =
      req.body;
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
      timerType,
      user: userId,
      assignee: assignee,
      timerState: {
        startTime: null,
        remainingTime: initalTaskDuration,
        isPaused: false,
      },
    });

    const savedTask = await newTask.save();

    // Update the project's updatedAt field
    await Project.findByIdAndUpdate(project, { $set: { updatedAt: new Date() } });

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
