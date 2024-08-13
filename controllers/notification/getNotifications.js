const Notification = require('../../models/notificationModel');

const getNotifications = async (req, res) => {
  try {
    console.log('getNotifications');
    const userId = req.user.id;

    // Fetch notifications for the user, sorted by createdAt in descending order
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'username')
      .populate('project', 'name');

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

module.exports = getNotifications;
