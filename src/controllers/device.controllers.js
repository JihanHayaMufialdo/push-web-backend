const { Device } = require('../models');

const pushToken = async (req, res) => {
    const { nip, token, platform, id } = req.body

    if(!token){
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const device = await Device.findOne({ where: { id } });

        if (device) {
            await device.update({ token, isActive: true });
        } else {
            await Device.create({ id, token, nip, platform, isActive: true });
        }
    
    
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deviceLogout = async (req, res) => {
	const { id, token } = req.body;
  
	await Device.update(
	  { isActive: false },
	  { where: { id, token } }
	);
  
	res.json({ success: true });
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

module.exports = { pushToken, deviceLogout, getDevices };