import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import { get, list, create, update, remove, load } from './user.controller';
import authenticate from '../middleware/authenticate';

const router = express.Router(); // eslint-disable-line new-cap

router.all('*', authenticate);

router
  .route('/')
  /** GET /api/users - Get list of users */
  .get(list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), create);

router
  .route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', load);

export default router;
