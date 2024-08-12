const Task = require('../../models/taskModel');

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log('🚀  updateData:', updateData);
    console.log('🚀  updateData:', updateData);

    // Check if taskDuration is being updated
    if (updateData.taskDuration) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      if (updateData.taskDuration !== task.taskDuration) {
        updateData.timerState = {
          ...task.timerState,
          remainingTime: updateData.taskDuration,
        };
      } else {
        updateData.timerState = {
          ...task.timerState,
        };
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user', 'name email')
      .populate('assignee', 'name email');

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
