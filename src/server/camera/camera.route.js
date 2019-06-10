import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import {
  get,
  list,
  create,
  update,
  remove,
  load,
  toggleDetection,
} from './camera.controller';
import authenticate from '../middleware/authenticate';

const router = express.Router(); // eslint-disable-line new-cap

router.all('*', authenticate);

router
  .route('/')
  /** GET /api/cameras - Get list of cameras */
  .get(list)

  /** POST /api/cameras - Create new camera */
  .post(validate(paramValidation.createCamera), create);

router
  .route('/:cameraId')
  /** GET /api/cameras/:cameraId - Get camera */
  .get(get)

  /** PUT /api/cameras/:cameraId - Update camera */
  .put(validate(paramValidation.updateCamera), update)

  /** DELETE /api/cameras/:cameraId - Delete camera */
  .delete(remove);

router
  .route('/:cameraId/toggle-detection')
  /** GET /api/cameras/:cameraId/toggle-detection - Toggle camera detection state */
  .get(toggleDetection);

/** Load camera when API with cameraId route parameter is hit */
router.param('cameraId', load);

export default router;
