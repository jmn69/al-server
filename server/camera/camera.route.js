const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const cameraCtrl = require('./camera.controller');
const authenticate = require('../oauth/authenticate');

const router = express.Router(); // eslint-disable-line new-cap

router.all('*', authenticate());
router
  .route('/')
  /** GET /api/cameras - Get list of cameras */
  .get(cameraCtrl.list)

  /** POST /api/cameras - Create new camera */
  .post(validate(paramValidation.createCamera), cameraCtrl.create);

router
  .route('/:cameraId')
  /** GET /api/cameras/:cameraId - Get camera */
  .get(cameraCtrl.get)

  /** PUT /api/cameras/:cameraId - Update camera */
  .put(validate(paramValidation.updateCamera), cameraCtrl.update)

  /** DELETE /api/cameras/:cameraId - Delete camera */
  .delete(cameraCtrl.remove);

/** Load camera when API with cameraId route parameter is hit */
router.param('cameraId', cameraCtrl.load);

module.exports = router;
