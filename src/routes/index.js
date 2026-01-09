const express = require("express");

const userAuth = require('../middleware/auth.js');
const adminAuth =  require('../middleware/adminAuth.js')
const { User } = require('../models');
const { pushToken, deviceLogout, getDevices } = require('../controllers/device.controllers.js');
const { getUserNotifications } = require("../controllers/notification.controllers.js");
const { getAllDevices, getActiveDevices } = require('../controllers/admin/device.controllers.js');
const { sendToTopic, sendToUsers, getNotifications, getNotificationById, getNotificationUsers } = require("../controllers/admin/notification.controllers.js");
const { createTopic, assignUsersToTopic, getTopics, getTopicUsers, getTopicNotifications, updateTopic, unassignUsersFromTopic, getTopicById } = require("../controllers/admin/topic.controllers.js");
const { getUserTopics, getUserDevices, getEachUserNotifications } = require("../controllers/admin/user.controllers.js");
const { signIn, signOut } = require("../controllers/auth.controllers.js");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Push Notification API");
});

router.post('/auth/signin', signIn);
router.post('/auth/signout', signOut);

router.get('/admin/devices', adminAuth, getAllDevices);
router.get('/admin/active-devices', adminAuth, getActiveDevices);

router.get('/admin/topics', adminAuth, getTopics);
router.get('/admin/topic/:id', adminAuth, getTopicById);
router.post('/admin/create-topic', adminAuth, createTopic);
router.put('/admin/topic/:id/edit', adminAuth, updateTopic);
router.post('/admin/topic/:id/assign', adminAuth, assignUsersToTopic);
router.delete('/admin/topic/:id/unassign', adminAuth, unassignUsersFromTopic);
router.get('/admin/topic/:id/users', adminAuth, getTopicUsers);
router.get('/admin/topic/:id/notifications', adminAuth, getTopicNotifications);

router.get('/admin/notifications', adminAuth, getNotifications);
router.get('/admin/notification/:id', adminAuth, getNotificationById);
router.get('/admin/notification/:id/users', adminAuth, getNotificationUsers);
router.post('/admin/notification/send-topic', adminAuth, sendToTopic);
router.post('/admin/notification/send-users', adminAuth, sendToUsers);

router.get('/admin/user/:nip/devices', adminAuth, getUserDevices);
router.get('/admin/user/:nip/topics', adminAuth, getUserTopics);
router.get('/admin/user/:nip/notifications', adminAuth, getEachUserNotifications);

router.post('/push-token', pushToken);
router.put('/logout', deviceLogout);
router.get('/user-devices', userAuth, getDevices);
router.get('/user-notifications', userAuth, getUserNotifications);

router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({message: "Request success", users});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;