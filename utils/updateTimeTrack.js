// utils/timeTrackHelper.js
const TimeTrack = require('../models/timeTrackModel');

const updateTimeTrack = async (userId, taskId, projectId, elapsedTimeInSeconds) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    let timeTrack = await TimeTrack.findOne({
      user: userId,
      task: taskId,
      project: projectId,
      date: today,
    });

    if (timeTrack) {
      timeTrack.timeSpent += elapsedTimeInSeconds;
    } else {
      timeTrack = new TimeTrack({
        user: userId,
        task: taskId,
        project: projectId,
        date: today,
        timeSpent: elapsedTimeInSeconds,
      });
    }

    await timeTrack.save();
  } catch (error) {
    console.error('Error updating time track:', error);
  }
};

module.exports = { updateTimeTrack };
