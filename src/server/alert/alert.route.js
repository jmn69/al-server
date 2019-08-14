import express from 'express';
import { list, getS3Image, load } from './alert.controller';
import authenticate from '../middleware/authenticate';

const router = express.Router(); // eslint-disable-line new-cap

router.all(/^\/(?!image).*/, authenticate);

router
  .route('/')
  /** GET /api/alert - Get list of alerts */
  .get(list);

router
  .route('/image/:alertId')
  /** GET /api/alert/image/:alertId - Get s3 image resource */
  .get(getS3Image);

/** Load alert when API with alertId route parameter is hit */
router.param('alertId', load);

export default router;
