const { Notification, DeviceNotification, Device, Topic, DeviceTopic } = require('../../models');
const admin = require('../../config/firebase-admin');

const sendFromServer = async (req, res) => {
    const { no, text } = req.query;
    const { username } = req.user;

    console.log('username',username);
  
    try {
      // Check devices
      const device = await Device.findAll({
        where: {
          nip: no,
          isActive: true
         }
      });

      if (!device.length) {
        // Check topic
        const name = no.toUpperCase();
        const topic = await Topic.findOne({
            where: { name }
        });

        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }

        const notification = await Notification.create({
            body: text,
            sendBy: username,
            topicId: topic.id,
            status: 'queued'
        });
    
        try {
            await admin.messaging().send({
                topic: name,
                data: { body: text }
            });
            
            await notification.update({ status: 'sent' });
        } catch (err) {
            await notification.update({ status: 'failed' });
            throw err;
        }
    
        const devices = await DeviceTopic.findAll({
            where: {
                topicId: topic.id
            },
            include: [{ 
                model: Device,
                where: { isActive: true }
            }]
        });
    
        const logs = devices.map(dt => ({
            deviceId: dt.deviceId,
            notificationId: notification.id,
        }));
        
        await DeviceNotification.bulkCreate(logs);
        
        res.json({ success: true, devices: devices.length });

      } else {
        const tokens = device.map(d => d.token);

        const notification = await Notification.create({
            body: text,
            sendBy: username,
            status: 'queued'
        });

        const response = await admin.messaging().sendEachForMulticast({
            tokens,
            data: { body: text }
        });

        const FATAL_ERRORS = [
            'messaging/registration-token-not-registered',
            'messaging/invalid-registration-token'
        ];
        
        const invalidDeviceIds = [];
        const logs = [];

        response.responses.forEach((r, index) => {
        const dev = device[index];

        if(r.success) {
            logs.push({
                deviceId: dev.id, 
                notificationId: notification.id, 
                status: 'sent'
            });
        } else {
            const errorCode = r.error?.code;
            logs.push({
                deviceId: dev.id, 
                notificationId: notification.id, 
                status: 'failed',
            });

            console.log('ERROR:', r.error);

            if (FATAL_ERRORS.includes(errorCode)) {
                invalidDeviceIds.push(dev.id);
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
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

module.exports = { sendFromServer };