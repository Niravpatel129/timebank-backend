const Task = require('../../models/taskModel');

const finishTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.timerState.isActive) {
      const elapsedTime = new Date() - task.timerState.startTime;
      task.timeSpent += elapsedTime;
    }

    task.status = 'completed';
    task.timerState.isActive = false;
    task.timerState.remainingTime = 0;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error finishing task', error: error.message });
  }
};

module.exports = finishTask;
