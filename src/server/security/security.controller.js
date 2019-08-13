import Security from './security.model';
import DetectionStateEnum from '../camera/camera.enums';
import Camera from '../camera/camera.model';
import { setDetectionByCamera } from '../camera/camera.controller';

/**
 * Get security
 * @returns {Security}
 */
export const get = (req, res, next) => {
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
export const setSecurityMod = (req, res, next) => {
  Security.findOne(async (error, security) => {
    if (error) {
      next(error);
    }
    let cameras = null;
    let camerasStatusResultP = [];
    let camerasStatusResult = [];
    try {
      cameras = await Camera.list({ limit: 50, skip: 0 });
    }
 catch (e) {
      next(e);
    }
    if (cameras) {
      camerasStatusResultP = cameras.map(async camera => {
        try {
          const newDetectionState = req.body.lock
            ? DetectionStateEnum.Enabled
            : DetectionStateEnum.Disabled;
          await setDetectionByCamera(camera, newDetectionState);
          Camera.update(
            { _id: camera.id },
            { ioAlarm: Number(newDetectionState), isOnline: true },
            error => {
              if (error) {
                next(error);
              }
            }
          );
          return { id: camera.id, name: camera.name, succeed: true };
        }
 catch (e) {
          Camera.update(
            { _id: camera.id },
            { ioAlarm: null, isOnline: false },
            error => {
              if (error) {
                next(error);
              }
            }
          );
          return {
            id: camera.id,
            name: camera.name,
            succeed: false,
            error: e.message,
          };
        }
      });
      camerasStatusResult = await Promise.all(camerasStatusResultP);
    }

    Security.update(
      { _id: security.id },
      { $set: { lock: req.body.lock } },
      updateError => {
        if (updateError) {
          next(updateError);
        }
        res.json({ camerasStatus: camerasStatusResult });
      }
    );
  });
};
