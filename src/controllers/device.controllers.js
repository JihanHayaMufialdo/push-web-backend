const { Device } = require('../models');

const pushToken = async (req, res) => {
    const { token } = req.body;
    const userId = req.user.id;

    if(!token){
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        await Device.findOrCreate({
            where: { token, userId },
            defaults: { platform: 'web' },
        });
    
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getDevices = async (req, res) => {
    try {
        const devices = await Device.findAll();
        res.json({message: "Request success", devices});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { pushToken, getDevices };