const Security = require('./security.model');
const Enums = require('../camera/camera.enums');
const Camera = require('../camera/camera.model');
const cameraCtrl = require('../camera/camera.controller');

/**
 * Get security
 * @returns {Security}
 */
const get = (req, res, next) => {
  Security.findOne((error, security) => {
    if (error) {
      next(error);
    }
    return res.json(security);
  });
};

/**
 * Set the security mod
 * @property {boolean} req.body.lock - The state of the security lock.
 * @returns {Security}
 */
const setSecurityMod = (req, res, next) => {
  Security.findOne(async (error, security) => {
    if (error) {
      next(error);
    }
    let cameras = null;
    let camerasStatusResultP = [];
    let camerasStatusResult = [];
    try {
      cameras = await Camera.list({ limit: 50, skip: 0 });
    } catch (e) {
      next(e);
    }
    if (cameras) {
      camerasStatusResultP = cameras.map(async (camera) => {
        try {
          await cameraCtrl.setDetectionByCamera(
            camera,
            req.body.lock ? Enums.DetectionStateEnum.Enabled : Enums.DetectionStateEnum.Disabled
          );
          return { id: camera.id, succeed: true };
        } catch (e) {
          return { id: camera.id, succeed: false };
        }
      });
      camerasStatusResult = await Promise.all(camerasStatusResultP);
    }

    Security.update({ _id: security.id }, { $set: { lock: req.body.lock } }, (updateError) => {
      if (updateError) {
        next(updateError);
      }
      res.json({ camerasStatus: camerasStatusResult });
    });
  });
};

module.exports = { setSecurityMod, get };
