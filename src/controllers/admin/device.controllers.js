const { Device } = require('../../models');

const getAllDevices = async (req, res) => {
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

module.exports = { getAllDevices, getActiveDevices };