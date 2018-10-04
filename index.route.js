const express = require('express');
const userRoutes = require('./server/user/user.route');
const oauthRoutes = require('./server/oauth/oauth.route');
const cameraRoutes = require('./server/camera/camera.route');

const router = express.Router(); // eslint-disable-line new-cap

router.use('/', oauthRoutes);
router.get('/health-check', (req, res) => res.send('OK'));
router.use('/users', userRoutes);
router.use('/cameras', cameraRoutes);

module.exports = router;
