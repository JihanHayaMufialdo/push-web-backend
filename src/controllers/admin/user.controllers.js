const { Device, DeviceNotification, Notification, Topic, DeviceTopic } = require('../../models');

const getUserDevices = async (req, res) => {
    const { nip } = req.params;

    try {
        const devices = await Device.findAll({
            where: {
                nip
            },
            attributes: ['platform','isActive']
        });
        res.json({message: "Request success", devices});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getUserTopics = async (req,res) => {
    const { nip } = req.params;

    const devices = await Device.findAll({
        where: { nip }
    });

    const ids = devices.map(d => d.id);

    try {
        const topics = await DeviceTopic.findAll({
            where: { 
                deviceId: ids 
            },
            attributes: [],
            include: [
                {
                    model: Topic,
                    attributes: ['name']
                }
            ]

        });

        res.json({message: "Request success", topics});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getEachUserNotifications = async (req, res) => {
    const { nip } = req.params;

    const devices = await Device.findAll({
        where: { nip }
    });

    const ids = devices.map(d => d.id);

    try {
        const notifications = await DeviceNotification.findAll({
            order: [['createdAt', 'DESC']],
            where: {
              deviceId: ids
            },
            attributes: [],
            include: [
                {
                    model: Notification,
                    attributes: ['title','body','link','sendBy','status','createdAt'],
                    include: [
                        {
                            model: Topic,
                            attributes: ['name']
                        }
                    ]
                }
            ]
          });
        res.json({message: "Request success", notifications});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getUserDevices, getUserTopics, getEachUserNotifications }