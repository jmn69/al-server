const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const securityCtrl = require('./security.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.all('*', require('../middleware/authenticate'));

router
  .route('/')

  /** GET /api/security - Get the security mod */
  .get(securityCtrl.get)

  /** POST /api/security - Set the security mod */
  .post(validate(paramValidation.setSecurityMod), securityCtrl.setSecurityMod);

module.exports = router;
