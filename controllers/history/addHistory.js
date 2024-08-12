const History = require('../../models/historyModel');
const User = require('../../models/userModel');

const addHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { entityType, entityId, entityName, action, details, projectId } = req.body;

    // Validate the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const historyEntry = new History({
      userId,
      entityType,
      entityId,
      entityName,
      action,
      details,
      projectId,
    });

    await historyEntry.save();

    res.status(201).json({
      message: 'History entry added successfully',
      entry: historyEntry,
    });
  } catch (error) {
    console.error('Error adding history entry:', error);
    res.status(500).json({ message: 'Error adding history entry' });
  }
};

module.exports = addHistory;
