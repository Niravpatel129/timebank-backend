const Task = require('../../models/taskModel');

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if taskDuration is being updated
    if (updateData.taskDuration) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Calculate the ratio of remaining time to original duration
      const remainingRatio = task.timerState.remainingTime / (task.taskDuration * 60 * 1000);

      // Update the remaining time based on the new duration
      updateData.timerState = {
        ...task.timerState,
        remainingTime: Math.round(updateData.taskDuration * 60 * 1000 * remainingRatio),
      };
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = updateTask;
