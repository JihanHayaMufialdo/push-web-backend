const { Device, Topic, DeviceTopic } = require('../models');
const admin = require('../config/firebase-admin');

const getTopics = async (req, res) => {
    try {
        const topics = await Topic.findAll();
        res.json({message: "Request success", topics});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createTopic = async (req, res) => {
    const { name, description } = req.body;

    if(!name || !description){
        return res.status(400).json({ error: 'Name and description is required' });
    }

    try {
        await Topic.findOrCreate({
            where: { name, description }
        });
    
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const assignUsersToTopic = async (req, res) => {
    const topicId = req.params.topicId;
    const { nips } = req.body;

    try{
        // Get topic
        const topic = await Topic.findByPk(topicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found'});
        }

        // Get devices of selected users
        const devices = await Device.findAll({
            where: {
                nip: nips,
                isActive: true
            }
        });

        const tokens = devices.map(d => d.token);

        // Subscribe tokens in FCM
        const response = await admin.messaging().subscribeToTopic(
            tokens, 
            topic.name
        );

        // Store mapping in DB
        const FATAL_ERRORS = [
            'messaging/registration-token-not-registered',
            'messaging/invalid-registration-token'
        ];

        const invalidDeviceIds = [];

        response.errors.forEach(e => {
            const device = devices[e.index];
            const code = e.error.code;

            if (FATAL_ERRORS.includes(code)) {
                invalidDeviceIds.push(device.id);
            }
        });

        if (invalidDeviceIds.length > 0) {
            await Device.update(
                { 
                    isActive: false, 
                    lastError: 'invalid_token' 
                },
                { 
                    where: { id: invalidDeviceIds } 
                }
            );
        }
        
        const validDevices = devices.filter(
            d => !invalidDeviceIds.includes(d.id)
        );

        const records = validDevices.map(d => ({
            deviceId: d.id,
            topicId: topic.id
        }));

        await DeviceTopic.bulkCreate(records, { ignoreDuplicates: true });

        res.json({
            success: true,
            sent: response.successCount,
            failed: response.failureCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
};

const getTopicUsers = async (req, res) => {
    const { topicId } = req.params;

    try {
        const users = await DeviceTopic.findAll({
            where: {
                topicId: topicId,
            }
        });
        res.json({message: "Request success", users});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getTopics, createTopic, assignUsersToTopic, getTopicUsers };