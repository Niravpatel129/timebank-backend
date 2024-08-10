const Task = require('../../models/taskModel');

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, filterCategory, taskDuration } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.name = name || task.name;
    task.category = category || task.category;
    task.filterCategory = filterCategory || task.filterCategory;
    task.taskDuration = taskDuration || task.taskDuration;

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = updateTask;
