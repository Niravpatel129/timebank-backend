const History = require('../../models/historyModel');

const getEntityHistory = async (req, res) => {
  console.log('Entering getEntityHistory function');
  try {
    const { entityType, entityId } = req.params;
    console.log(`Retrieving history for entityType: ${entityType}, entityId: ${entityId}`);

    const history = await History.find({ entityType, entityId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username');

    console.log(`Found ${history.length} history entries`);

    if (!history || history.length === 0) {
      console.log('No history found for this entity');
      return res.status(404).json({ message: 'No history found for this entity' });
    }

    console.log('Sending successful response with history');
    res.status(200).json({
      message: 'Entity history retrieved successfully',
      history: history,
    });
  } catch (error) {
    console.error('Error retrieving entity history:', error);
    res.status(500).json({ message: 'Error retrieving entity history' });
  }
  console.log('Exiting getEntityHistory function');
};

module.exports = getEntityHistory;
