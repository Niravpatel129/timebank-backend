const Task = require('../../models/taskModel');

const startTaskTimer = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.status = 'in_progress';
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error starting task timer', error: error.message });
  }
};

module.exports = startTaskTimer;
