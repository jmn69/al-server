import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import { login, token } from './auth.controller';

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/login')

  /** POST /api/login - Login */
  .post(validate(paramValidation.login), login);

router
  .route('/token')
  /** POST /api/token - Refresh token */
  .post(validate(paramValidation.token), token);

export default router;
