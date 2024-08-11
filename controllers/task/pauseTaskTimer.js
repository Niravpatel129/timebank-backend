const Task = require('../../models/taskModel');
const { updateTimeTrack } = require('../../utils/updateTimeTrack');

const pauseTaskTimer = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    const remainingTime = req.body.remainingTime;

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.timerState.isActive) {
      return res.status(400).json({ message: 'Timer is not active' });
    }

    const elapsedTimeInSeconds = Math.floor((new Date() - task.timerState.startTime) / 1000);
    task.timeSpent += elapsedTimeInSeconds;

    await updateTimeTrack(task.user, task._id, task.project, elapsedTimeInSeconds);

    task.timerState.remainingTime = remainingTime;
    task.timerState.isActive = false;
    task.status = 'paused';
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error pausing timer', error: error.message });
  }
};

module.exports = pauseTaskTimer;
