import express from 'express';
import userRoutes from './server/user/user.route';
import authRoutes from './server/auth/auth.route';
import cameraRoutes from './server/camera/camera.route';
import securityRoutes from './server/security/security.route';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/auth', authRoutes);
router.get('/health-check', (req, res) => res.send('OK'));
router.use('/users', userRoutes);
router.use('/cameras', cameraRoutes);
router.use('/security', securityRoutes);

export default router;
