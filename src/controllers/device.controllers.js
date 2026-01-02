const { where } = require('sequelize');
const { Device } = require('../models');

const pushToken = async (req, res) => {
    const { token, platform, nip } = req.body

    if(!token){
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        await Device.findOrCreate({
            where: { token, nip, platform },
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

const getActiveDevices = async (req, res) => {
    try {
        const devices = await Device.findAll({
            where: {
                isActive: true
            }
        });
        res.json({message: "Request success", devices});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { pushToken, getDevices, getActiveDevices };