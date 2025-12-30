const { Notification, DeviceNotification, Device, Topic, DeviceTopic } = require('../models');
const admin = require('../config/firebase-admin.js');

const getNotifications = async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const notifications = await Notification.findAll({
          limit,
          offset,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: DeviceNotification,
              include: ['Device']
            }
          ],
        });
        res.json({message: "Request success", notifications});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getNotificationDevice = async (req, res) => {
    const userId = req.user.id;

    const devices = await Device.findAll({
      where: { 
        userId: userId 
      }
    });

    const ids = devices.map(d => d.id);

    try {
        const notifications = await DeviceNotification.findAll({
            where: {
              deviceId: ids
            }
        });
        res.json({message: "Request success", notifications});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const sendToTopic = async (req, res) => {
    const { topicId, title, body, link } = req.body;
    const adminId = req.user.id;
  
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
        sendBy: adminId,
        link
      });

      // Send via FCM topic
      try {
        await admin.messaging().send({
          topic: topic.name,
          notification: { title, body },
          // data: { title, body, link }
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
      const logs = DeviceTopic.map(dt => ({
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
    const { userIds, title, body, link } = req.body;
    const adminId = req.user.id;
  
    try {
      // Get devices
      const devices = await Device.findAll({
        where: {
          userId: userIds,
          isActive: true
         }
      });
  
      const tokens = devices.map(d => d.token);
  
      // Create notification
      const notification = await Notification.create({
        title,
        body,
        sendBy: adminId,
        link,
      });

      // Send via FCM
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body }
        // data: { title, body, link }
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
            // error: r.error?.message
          });

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

module.exports = { sendToTopic, sendToUsers, getNotificationDevice, getNotifications }