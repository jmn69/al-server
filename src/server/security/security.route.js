import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import { get, setSecurityMod } from './security.controller';
import authenticate from '../middleware/authenticate';

const router = express.Router(); // eslint-disable-line new-cap

router.all('*', authenticate);

router
  .route('/')

  /** GET /api/security - Get the security mod */
  .get(get)

  /** POST /api/security - Set the security mod */
  .post(validate(paramValidation.setSecurityMod), setSecurityMod);

export default router;
