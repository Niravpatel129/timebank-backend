const TaskActivity = require('../../models/taskActivityModel');

const getTaskActivityMetrics = async (req, res) => {
  try {
    // Extract necessary parameters from the request
    const { taskId, startDate, endDate } = req.query;

    // Validate input parameters
    if (!taskId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Query the database for task activity metrics
    const metrics = await TaskActivity.aggregate([
      {
        $match: {
          taskId: mongoose.Types.ObjectId(taskId),
          timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: null,
          totalTime: { $sum: '$duration' },
          activityCount: { $sum: 1 },
          averageDuration: { $avg: '$duration' },
        },
      },
      {
        $project: {
          _id: 0,
          totalTime: 1,
          activityCount: 1,
          averageDuration: 1,
        },
      },
    ]);

    // Check if metrics were found
    if (metrics.length === 0) {
      return res
        .status(404)
        .json({ message: 'No activity metrics found for the given task and date range' });
    }

    // Send the response
    res.status(200).json(metrics[0]);
  } catch (error) {
    console.error('Error in getTaskActivityMetrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = getTaskActivityMetrics;
