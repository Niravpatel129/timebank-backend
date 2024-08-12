const TaskActivity = require('../../models/taskActivityModel');

const getTaskActivities = async (req, res) => {
  try {
    const taskActivities = await TaskActivity.find().sort({ createdAt: -1 });
    res.status(200).json(taskActivities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task activities', error: error.message });
  }
};

module.exports = getTaskActivities;
