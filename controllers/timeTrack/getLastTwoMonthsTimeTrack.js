const TimeTrack = require('../../models/timeTrackModel');

const getLastTwoMonthsTimeTrack = async (req, res) => {
  try {
    const userId = req.user.id;
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 2);

    const timeTrackData = await TimeTrack.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            project: '$project',
          },
          totalTimeSpent: { $sum: '$timeSpent' },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          projects: {
            $push: {
              project: '$_id.project',
              timeSpent: '$totalTimeSpent',
            },
          },
          totalDailyTimeSpent: { $sum: '$totalTimeSpent' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json(timeTrackData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching time track data', error: error.message });
  }
};

module.exports = getLastTwoMonthsTimeTrack;
