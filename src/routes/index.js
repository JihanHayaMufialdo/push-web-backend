const express = require("express");

const userAuth = require('../middleware/auth.js');
const adminAuth =  require('../middleware/adminAuth.js')
const { User } = require('../models');
const { pushToken, getDevices, getActiveDevices } = require('../controllers/device.controllers.js');
const { sendToTopic, sendToUsers, getNotifications, getNotificationDevice } = require("../controllers/notification.controllers.js");
const { createTopic, assignUsersToTopic, getTopics, getTopicUsers } = require("../controllers/topic.controllers.js");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Push Notification API");
});

router.post('/push-token', userAuth, pushToken);
router.get('/devices', userAuth, getDevices);
router.get('/active-devices', userAuth, getActiveDevices);

router.get('/topics', adminAuth, getTopics);
router.post('/create-topic', adminAuth, createTopic);
router.post('/topic/:topicId/assign', adminAuth, assignUsersToTopic);
router.get('/topic/:topicId/users', adminAuth, getTopicUsers);
// router.post('/topic/:topicId/unassign', adminAuth, unassignUsersFromTopic);

router.get('/notifications', adminAuth, getNotifications);
router.post('/send-topic', adminAuth, sendToTopic);
router.post('/send-users', adminAuth, sendToUsers);
router.get('/user-notifications', userAuth, getNotificationDevice);

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({message: "Request success", users});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;