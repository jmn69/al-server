import axios from 'axios';
import { parseString } from 'xml2js';
import https from 'https';

import DetectionStateEnum from './camera.enums';
import Camera from './camera.model';

const rootCas = require('ssl-root-cas').create();
require('https').globalAgent.options.ca = rootCas;

const agent = new https.Agent({ rejectUnauthorized: false, timeout: 5000 });

/**
 * Load camera and append to req.
 */
export const load = (req, res, next, id) => {
  Camera.get(id)
    .then(camera => {
      req.camera = camera; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
};

/**
 * Get camera
 * @returns {Camera}
 */
export const get = (req, res) => {
  return res.json(req.camera);
};

/**
 * Create new camera
 * @property {string} req.body.name - The name of the camera.
 * @property {number} req.body.type - The type of camera.
 * @property {string} req.body.publicDomain - The public domain/ip of camera.
 * @property {string} req.body.privateIp - The private ip of camera. For lan access
 * @property {string} req.body.pwd - The password of camera.
 * @property {string} req.body.user - The username of camera.
 * @property {string} req.body.wsStreamUrl - The webservice url of the camera stream mjpeg format.
 * @returns {Camera}
 */
export const create = (req, res, next) => {
  const camera = new Camera({
    name: req.body.name,
    type: req.body.type,
    publicDomain: req.body.publicDomain,
    privateIp: req.body.privateIp,
    pwd: req.body.pwd,
    user: req.body.user,
    ioAlarm: req.body.ioAlarm,
    isOnline: req.body.isOnline,
    wsStreamUrl: req.body.wsStreamUrl,
  });

  camera
    .save()
    .then(savedCamera => res.json(savedCamera))
    .catch(e => next(e));
};

/**
 * Update existing camera
 * @property {string} req.body.name - The name of the camera.
 * @property {number} req.body.type - The type of camera.
 * @property {string} req.body.publicDomain - The public domain/ip of camera.
 * @property {string} req.body.privateIp - The private ip of camera
 * @property {string} req.body.pwd - The password of camera.
 * @property {string} req.body.user - The username of camera.
 * @property {number} req.body.ioAlarm - The alarm state camera.
 * @property {boolean} req.body.isOnline - The camera status.
 * @property {string} req.body.wsStreamUrl - The webservice url of the camera stream.
 * @returns {Camera}
 */
export const update = (req, res, next) => {
  const camera = {};
  camera.name = req.body.name;
  camera.type = req.body.type;
  camera.publicDomain = req.body.publicDomain;
  camera.privateIp = req.body.privateIp;
  camera.pwd = req.body.pwd;
  camera.user = req.body.user;
  camera.ioAlarm = req.body.ioAlarm ? req.body.ioAlarm : null;
  camera.isOnline = req.body.isOnline;
  camera.wsStreamUrl = req.body.wsStreamUrl;

  Camera.update({ _id: req.camera.id }, { $set: camera }, error => {
    if (error) {
      next(error);
    }
    res.json({ success: true });
  });
};

// TODO: Do something better with every type of camera
export const setDetectionFoscam = async (camera, newDetectionState) => {
  try {
    const response = await axios.get(
      `https://${camera.publicDomain}/cgi-bin/CGIProxy.fcgi?cmd=setMotionDetectConfig&
      isEnable=${newDetectionState}&linkage=142&snapInterval=2&sensitivity=1&triggerInterval=5&
      isMovAlarmEnable=1&isPirAlarmEnable=1&schedule0=281474976710655&schedule1=281474976710655&
      schedule2=281474976710655&schedule3=281474976710655&schedule4=281474976710655&
      schedule5=281474976710655&schedule6=281474976710655&area0=1023&area1=1023&area2=1023&
      area3=1023&area4=1023&area5=1023&area6=1023&area7=1023&area7=1023&area8=1023&area9=1023&
      usr=${camera.user}&pwd=${camera.pwd}`,
      {
        httpsAgent: agent,
      }
    );
    if (response && response.status === 200 && response.data) {
      parseString(response.data, { explicitArray: false }, (err, result) => {
        if (
          result &&
          result.CGI_Result &&
          Number(result.CGI_Result.result) === 0
        ) {
          return Promise.resolve();
        }
        return Promise.reject();
      });
    }
 else {
      return Promise.reject();
    }
  }
 catch (e) {
    return Promise.reject(e);
  }
};

export const setDetectionByCamera = async (camera, newDetectionState) => {
  try {
    switch (camera.type) {
      case 1: {
        await setDetectionFoscam(camera, newDetectionState);
        return Promise.resolve();
      }
      default:
        return Promise.reject();
    }
  }
 catch (e) {
    return Promise.reject(e);
  }
};

/**
 * Toggle camera state if possible
 * @returns {boolean}
 */
export const toggleDetection = (req, res, next) => {
  const newDetectionState =
    req.camera.ioAlarm === DetectionStateEnum.Disabled
      ? DetectionStateEnum.Enabled
      : DetectionStateEnum.Disabled;
  const succeed = setDetectionByCamera(req.camera, newDetectionState);
  if (succeed) {
    Camera.update(
      { _id: req.camera.id },
      { ioAlarm: Number(newDetectionState), isOnline: true },
      error => {
        if (error) {
          next(error);
        }
        res.json({ success: true });
      }
    );
  }
};

/**
 * Get camera list.
 * @property {number} req.query.skip - Number of cameras to be skipped.
 * @property {number} req.query.limit - Limit number of cameras to be returned.
 * @returns {Camera[]}
 */
export const list = (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  Camera.list({ limit, skip })
    .then(cameras => res.json(cameras))
    .catch(e => next(e));
};

/**
 * Delete camera.
 * @returns {Camera}
 */
export const remove = (req, res, next) => {
  const camera = req.camera;
  camera
    .remove()
    .then(deletedCam => res.json(deletedCam))
    .catch(e => next(e));
};
