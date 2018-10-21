const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('./auth.controller');

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/login')

  /** POST /api/login - Login */
  .post(validate(paramValidation.login), authCtrl.login);

router
  .route('/token')
  /** POST /api/token - Refresh token */
  .post(validate(paramValidation.token), authCtrl.token);

module.exports = router;
