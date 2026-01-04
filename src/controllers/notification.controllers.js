const { DeviceNotification, Device, Notification } = require('../models');

const getUserNotifications = async (req, res) => {
    const nip = req.user.nip;

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

module.exports = { getUserNotifications }