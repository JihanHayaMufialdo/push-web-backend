const { DeviceNotification, Device, Notification } = require('../models');
const { Sequelize } = require('sequelize');

const getUserNotifications = async (req, res) => {
  const { device_id } = req.user;

  const user = await Device.findOne({
    where: { id: device_id }
  });

  const device = await Device.findAll({
    where: { nip: user.nip }
  });

  const ids = device.map(d => d.id);

  try {
    const notifications = await DeviceNotification.findAll({
      where: { deviceId: ids },
      include: [
        {
          model: Notification,
          where: { status: 'sent' },
          attributes: ['id', 'title', 'body', 'link', 'createdAt']
        }
      ],
      attributes: [
        'notificationId',
        [Sequelize.fn('MIN', Sequelize.col('DeviceNotification.readAt')), 'readAt'],
        [Sequelize.fn('MAX', Sequelize.col('DeviceNotification.createdAt')), 'lastReceivedAt']
      ],
      group: ['notificationId', 'Notification.id'],
      order: [[Sequelize.fn('MIN', Sequelize.col('DeviceNotification.readAt')), 'ASC'], ['lastReceivedAt', 'DESC']]
    });

    const grouped = { unread: [], read: [] };

    notifications.forEach((dn) => {
      const notificationData = {
        notificationId: dn.notificationId,
        title: dn.Notification.title,
        body: dn.Notification.body,
        link: dn.Notification.link,
        createdAt: dn.Notification.createdAt,
        readAt: dn.getDataValue('readAt') 
      };

      if (!notificationData.readAt) {
        grouped.unread.push(notificationData);
      } else {
        grouped.read.push(notificationData);
      }
    });

    grouped.unread.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    grouped.read.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      message: 'Request success',
      notifications: grouped
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAsRead = async (req, res) => {
  const { device_id } = req.user;

  const user = await Device.findOne({
    where: { id: device_id }
  });

  const device = await Device.findAll({
    where: { nip: user.nip }
  });

  const ids = device.map(d => d.id);

  try {
    const [count] = await DeviceNotification.update(
      { readAt: new Date() },
      {
        where: { deviceId: ids, readAt: null }
      }
    );

    res.json({message: "Request success", count});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

const countUnread = async (req, res) => {
  const { device_id } = req.user;

  try {
    const user = await Device.findOne({ where: { id: device_id } });
    if (!user) return res.status(404).json({ error: 'Device not found' });

    const devices = await Device.findAll({ where: { nip: user.nip } });
    const ids = devices.map(d => d.id);

    const count = await DeviceNotification.count({
      where: {
        deviceId: ids,
        readAt: null
      },
      distinct: true,
      col: 'notificationId'
    });

    res.json({ message: 'Request success', count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserNotifications, countUnread, markAsRead }