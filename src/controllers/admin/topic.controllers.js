const { Device, Topic, DeviceTopic, Notification, User } = require('../../models');
const admin = require('../../config/firebase-admin');

const getTopics = async (req, res) => {
    try {
        const topics = await Topic.findAll({
            order: [['updatedAt', 'DESC']],
            include: [
                {
                    model: DeviceTopic,
                    attributes: ['id'],
                    include: [
                        {
                            model: Device,
                            attributes: ['id'],
                            include: [
                                {
                                    model: User,
                                    attributes: ['nip']
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        res.json({message: "Request success", topics});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getTopicById = async (req, res) => {
    const { id } = req.params;
    try {
        const topic = await Topic.findOne({
            where: { id },
        });
        res.json({message: "Request success", topic});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const createTopic = async (req, res) => {
    const { name, description } = req.body;

    if(!name || !description){
        return res.status(400).json({ error: 'Name and description is required' });
    }

    const names = name.toUpperCase();

    try {
        const topic = await Topic.findOrCreate({
            where: { name: names, description }
        });
    
        res.status(201).json({ 
            message: 'Topic created',
            data: topic
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateTopic = async (req, res) =>{
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const topic = await Topic.findByPk(id);
        
        if(!topic) {
            return res.status(404).json({
                message: 'Topic not found'
            });
        };

        await topic.update({
            name, description
        });

        return res.status(200).json({
            message: 'Topic updated',
            data: topic
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

const assignUsersToTopic = async (req, res) => {
    const { id } = req.params;
    const { nips } = req.body;

    try{
        // Get topic
        const topic = await Topic.findByPk(id);

        if (!topic) {
            return res.status(404).json({ 
                error: 'Topic not found'
            });
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

const unassignUsersFromTopic = async (req,res) => {
    const { id } = req.params;
    const { nips } = req.body;

    try{
        const topic = await Topic.findByPk(id);

        if(!topic) {
            return res.status(404).json({
                error: 'Topic not found'
            });
        }

        const devices = await Device.findAll({
            where: { 
                nip: nips,
                isActive: true
            }
        });

        const tokens = devices.map(d => d.token);

        const response = await admin.messaging().unsubscribeFromTopic(
            tokens,
            topic.name
        );

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

        const records = devices.map(d => d.id);

        await DeviceTopic.destroy({
            where: {
                deviceId: records,
                topicId: topic.id
            }
        });
        
        res.json({
            success: true,
            sent: response.successCount,
            failed: response.failureCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
}

const getTopicNotifications = async (req, res) => {
    const { id } = req.params;

    try {
        const notifications = await Notification.findAll({
            where: { topicId: id }
        });
        res.json({message: "Request success", notifications});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getTopicUsers = async (req, res) => {
    const { id } = req.params;

    try {
        const users = await DeviceTopic.findAll({
            where: {
                topicId: id
            },
            attributes: [],
            include: [ 
                {
                    model: Topic,
                    attributes: ['name']
                },
                {
                    model: Device,
                    attributes: ['platform'],
                    include: [
                        {
                            model: User,
                            attributes: ['nip', 'name', 'department']
                        }
                    ]
                }
            ],
        });


        res.json({message: "Request success", users});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getTopics, getTopicById, createTopic, updateTopic, assignUsersToTopic, unassignUsersFromTopic, getTopicUsers, getTopicNotifications };