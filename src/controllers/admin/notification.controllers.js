const { Notification, DeviceNotification, Device, Topic, DeviceTopic, User } = require('../../models');
const admin = require('../../config/firebase-admin');

const getNotifications = async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;

        const notifications = await Notification.findAll({
          limit,
          offset,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: Topic,
              attributes: ['name']
            },
            {
              model: DeviceNotification,
              attributes: ['status'],
              include: [
                {
                  model: Device,
                  attributes: ['platform','nip'],
                }
              ]
            },
          ]
        });
        res.json({message: "Request success", notifications});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
      const notification = await Notification.findOne({
          where: { id },
      });
      res.json({message: "Request success", notification});
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

const sendToTopic = async (req, res) => {
    const { topicId, title, body, link } = req.body;
    const { username } = req.user;
  
    try {
      // Get topic
      const topic = await Topic.findByPk(topicId);
      
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }

      // Create notification record
      const notification = await Notification.create({
        title,
        body,
        sendBy: username,
        link,
        topicId
      });

      // Send via FCM topic
      try {
        await admin.messaging().send({
          topic: topic.name,
          data: { title, body, link }
        });
      
        await notification.update({ status: 'sent' });
      } catch (err) {
        await notification.update({ status: 'failed' });
        throw err;
      }

      // Get target devices
      const devices = await DeviceTopic.findAll({
        where: {
          topicId
        },
        include: [{ 
          model: Device,
          where: { isActive: true }
        }]
      });

      // Create per-device logs
      const logs = devices.map(dt => ({
        deviceId: dt.deviceId,
        notificationId: notification.id,
      }));
  
      await DeviceNotification.bulkCreate(logs);
  
      res.json({ success: true, devices: devices.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const sendToUsers = async (req, res) => {
    const { nips, title, body, link } = req.body;
    const { username } = req.user;
  
    try {
      // Get devices
      const devices = await Device.findAll({
        where: {
          nip: nips,
          isActive: true
         }
      });
  
      const tokens = devices.map(d => d.token);
  
      // Create notification
      const notification = await Notification.create({
        title,
        body,
        sendBy: username,
        link,
        status: 'queued'
      });

      // Send via FCM
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        data: { title, body, link }
      });
  
      // Create logs
      const FATAL_ERRORS = [
        'messaging/registration-token-not-registered',
        'messaging/invalid-registration-token'
      ];
      
      const invalidDeviceIds = [];
      const logs = [];

      response.responses.forEach((r, index) => {
        const device = devices[index];

        if(r.success) {
          logs.push({
            deviceId: device.id, 
            notificationId: notification.id, 
            status: 'sent'
          });
        } else {
          const errorCode = r.error?.code;
          logs.push({
            deviceId: device.id, 
            notificationId: notification.id, 
            status: 'failed',
          });

          console.log('ERROR:', r.error);

          if (FATAL_ERRORS.includes(errorCode)) {
            invalidDeviceIds.push(device.id);
          }
        }
      });

      if (invalidDeviceIds.length > 0) {
        await Device.update(
          {
            isActive: false,
            lastError: 'invalid_token'
          },
          {
            where: { id: invalidDeviceIds}
          }
        );
      }

      await DeviceNotification.bulkCreate(logs);

      const successCount = response.successCount;
      const failureCount = response.failureCount;

      let finalStatus = 'failed';

      if (successCount > 0) {
        finalStatus = 'sent';
      }

      await notification.update({
        status: finalStatus
      });

      res.json({
        success: true,
        sent: successCount,
        failed: failureCount
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const getNotificationUsers = async (req, res) => {
  const { id } = req.params;

  try {
      const users = await DeviceNotification.findAll({
          where: {
              notificationId: id
          },
          include: [
            {
              model: Device,
              attributes: ['platform', 'nip'],
            }
          ]
      });


      res.json({message: "Request success", users});
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

module.exports = { sendToTopic, sendToUsers, getNotifications, getNotificationById, getNotificationUsers }