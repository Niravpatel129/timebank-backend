const History = require('../../models/historyModel');

const getProjectHistory = async (req, res) => {
  console.log('Entering getProjectHistory function');
  try {
    const { projectId } = req.params;
    if (!projectId) return res.status(400).json({ message: 'Project ID is required' });

    console.log(`Retrieving history for projectId: ${projectId}`);

    const history = await History.find({ projectId })
      .sort({ timestamp: -1 })
      .populate('userId', 'username');

    console.log(`Found ${history.length} history entries for the project`);

    if (history.length === 0) {
      console.log('No history found for this project');
      return res.status(404).json({ message: 'No history found for this project' });
    }

    const formattedHistory = history.map((entry) => ({
      ...entry.toObject(),
      logMessage: entry.generateLogMessage(),
    }));

    console.log('Sending successful response with project history');
    res.status(200).json({
      message: 'Project history retrieved successfully',
      history: formattedHistory,
    });
  } catch (error) {
    console.error('Error retrieving project history:', error);
    res.status(500).json({ message: 'Error retrieving project history' });
  }
  console.log('Exiting getProjectHistory function');
};

module.exports = getProjectHistory;
