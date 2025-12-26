const { Notification, DeviceNotification, Device, Topic, DeviceTopic } = require('../models');
const admin = require('../config/firebase-admin.js');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
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
  
      // Get target devices
      const devices = await DeviceTopic.findAll({
        where: {
          topicId
        },
        include: [{ model: Device }]
      });
  
      // Create per-device logs
      const logs = devices.map(d => ({
        deviceId: d.Device.id,
        notificationId: notification.id,
      }));
  
      await DeviceNotification.bulkCreate(logs);

      // Send via FCM topic
      await admin.messaging().send({
        topic: topic.name,
        notification: { title, body }
        // data: { title, body, link }
      });
  
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
        link
      });
  
      // Create logs
      const logs = devices.map(d => ({ 
        deviceId: d.id, 
        notificationId: notification.id, 
      }));
  
      await DeviceNotification.bulkCreate(logs);

      // Send via FCM
      await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body }
        // data: { title, body, link }
      });

      res.json({ success: true, devices: devices.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

module.exports = { sendToTopic, sendToUsers, getNotificationDevice, getNotifications }