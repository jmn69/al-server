import express from 'express';
import { list, getS3Image, getS3Video, load } from './alert.controller';
import authenticate from '../middleware/authenticate';

const router = express.Router(); // eslint-disable-line new-cap

router.all(/^\/(?!s3).*/, authenticate);

router
  .route('/')
  /** GET /api/alert - Get list of alerts */
  .get(list);

router
  .route('/s3/image/:alertId')
  /** GET /api/alert/s3/image/:alertId - Get s3 image resource */
  .get(getS3Image);

router
  .route('/s3/video/:alertId')
  /** GET /api/alert/s3/video/:alertId - Get s3 video resource */
  .get(getS3Video);

/** Load alert when API with alertId route parameter is hit */
router.param('alertId', load);

export default router;
