const express = require('express');
const { Device } = require('../models');

const router = express.Router();

router.post('/push-token', async (req, res) => {
    const { token } = req.body;

    if(!token){
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        await Device.findOrCreate({
            where: { token },
            defaults: { platform: 'web' },
        });
    
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
});

router.get('/devices', async (req, res) => {
    try {
        const devices = await Device.findAll();
        res.json({message: "Request success", devices});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;