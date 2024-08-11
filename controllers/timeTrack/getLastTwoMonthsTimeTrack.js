const TimeTrack = require('../../models/timeTrackModel');
const mongoose = require('mongoose');

const getLastTwoMonthsTimeTrack = async (req, res) => {
  try {
    console.log('Starting getLastTwoMonthsTimeTrack function');
    const userId = req.user.id;
    const selectedProjectId = req.params.projectId;

    console.log(`User ID: ${userId}, Selected Project ID: ${selectedProjectId}`);

    if (!selectedProjectId) {
      console.log('Selected project ID is missing');
      return res.status(400).json({ message: 'Selected project ID is required' });
    }

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 2);

    console.log(`Start Date: ${startDate.toISOString()}, End Date: ${endDate.toISOString()}`);

    const timeTrackData = await TimeTrack.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          project: new mongoose.Types.ObjectId(selectedProjectId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          timeSpent: { $sum: '$timeSpent' },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          timeSpent: 1,
        },
      },
    ]);

    console.log(`Time track data retrieved. Number of records: ${timeTrackData.length}`);

    res.status(200).json(timeTrackData);
  } catch (error) {
    console.error('Error in getLastTwoMonthsTimeTrack:', error);
    res.status(500).json({ message: 'Error fetching time track data', error: error.message });
  }
};

module.exports = getLastTwoMonthsTimeTrack;
