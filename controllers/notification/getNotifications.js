const Notification = require('../../models/notificationModel');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;

    // Fetch pending notifications for the user by userId or email, sorted by createdAt in descending order
    const notifications = await Notification.find({
      $or: [{ recipient: userId }, { email: userEmail }],
      invitationStatus: 'pending',
    })
      .sort({ createdAt: -1 })
      .populate('relatedProject', 'name');

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching pending notifications:', error);
    res.status(500).json({ message: 'Error fetching pending notifications', error: error.message });
  }
};

module.exports = getNotifications;
