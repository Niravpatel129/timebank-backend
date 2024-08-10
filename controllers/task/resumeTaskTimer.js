const Task = require('../../models/taskModel');

const resumeTaskTimer = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.timerState.isActive) {
      return res.status(400).json({ message: 'Timer is already active' });
    }

    task.timerState.isActive = true;
    task.timerState.startTime = new Date();
    task.status = 'in-progress';

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error resuming timer', error: error.message });
  }
};

module.exports = resumeTaskTimer;
