const Task = require('../../models/taskModel');

const stopTaskTimer = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeSpent } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.timeSpent += timeSpent;
    task.status = 'paused';
    const updatedTask = await task.save();

    // Calculate total time spent and daily time spent
    const totalTimeSpent = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$timeSpent' } } },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyTimeSpent = await Task.aggregate([
      { $match: { user: req.user._id, updatedAt: { $gte: today } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          total: { $sum: '$timeSpent' },
        },
      },
    ]);

    res.json({
      task: updatedTask,
      totalTimeSpent: totalTimeSpent[0]?.total || 0,
      dailyTimeSpent: Object.fromEntries(dailyTimeSpent.map(({ _id, total }) => [_id, total])),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error stopping task', error: error.message });
  }
};

module.exports = stopTaskTimer;
