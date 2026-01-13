const { DeviceNotification, Device, Notification } = require('../models');

const getUserNotifications = async (req, res) => {
    const { nip } = req.user;

    const device = await Device.findOne({
      where: { nip }
    });

    const id = device.id;

    try {
        const notifications = await DeviceNotification.findAll({
          order: [['createdAt', 'DESC']],
          where: {
            deviceId: id
          },
          include: [
            {
              model: Notification,
              where: {
                status: 'sent'
              },
              attributes: ['title','body','link','createdAt']
            }
          ]
        });
        res.json({message: "Request success", notifications});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const countUnread = async (req, res) => {
  const { device_id } = req.user;

  const user = await Device.findOne({
    where: { id: device_id }
  });

  console.log(`user: ${user}`)

  const device = await Device.findOne({
    where: { nip: user.nip }
  });

  console.log(`device: ${device}`)

  const id = device.id;

  try {
    const notif = await DeviceNotification.findAll({
      where: {
        deviceId: id
      },
      include: [
        {
          model: Notification,
          where: {
            readAt: null
          }
        }
      ]
    });

    const count = notif.length;

    res.json({message: "Request success", count});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getUserNotifications, countUnread }