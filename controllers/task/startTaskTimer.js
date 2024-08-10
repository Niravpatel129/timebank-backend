const Task = require('../../models/taskModel');

const startTaskTimer = async (req, res) => {
  try {
    console.log('Starting task timer...');
    const taskId = req.params.id;
    console.log('Task ID:', taskId);
    const task = await Task.findById(taskId);

    if (!task) {
      console.log('Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.timerState.isActive) {
      console.log('Timer is already active');
      return res.status(400).json({ message: 'Timer is already active' });
    }

    task.timerState.isActive = true;
    task.timerState.startTime = new Date();
    task.status = 'in-progress';
    console.log('Timer started:', task.timerState.startTime);

    if (task.timerState.remainingTime === 0) {
      task.timerState.remainingTime = task.taskDuration * 60 * 1000; // Convert minutes to milliseconds
      console.log('Remaining time set:', task.timerState.remainingTime);
    }

    await task.save();
    console.log('Task saved successfully');

    res.status(200).json(task);
  } catch (error) {
    console.error('Error starting timer:', error.message);
    res.status(500).json({ message: 'Error starting timer', error: error.message });
  }
};

module.exports = startTaskTimer;
