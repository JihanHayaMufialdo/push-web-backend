// const { where } = require('sequelize');
const { Device } = require('../models');

const pushToken = async (req, res) => {
    const { token, platform, nip } = req.body
    // const { token, platform = 'web' } = req.body;
    // const nip = req.user.nip;

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
    const nip = req.user.nip;

    try {
        const devices = await Device.findAll({
            where: { 
                nip,
                isActive: true
            }
        });
        res.json({message: "Request success", devices});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { pushToken, getDevices };