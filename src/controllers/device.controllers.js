// const { where } = require('sequelize');
const { Device } = require('../models');

const pushToken = async (req, res) => {
    const { nip, token, platform } = req.body

    if(!token){
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const device = await Device.findOne({ where: { token, nip, platform } });

        if (device) {
          if (!device.isActive) {
            await device.update({ isActive: true });
          }
        } else {
          await Device.create({ token, nip, platform, isActive: true });
        }
    
    
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getDevices = async (req, res) => {
    const { nip } = req.user;

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