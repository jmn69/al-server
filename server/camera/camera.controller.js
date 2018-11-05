const Camera = require('./camera.model');

/**
 * Load camera and append to req.
 */
function load(req, res, next, id) {
  Camera.get(id)
    .then((camera) => {
      req.camera = camera; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get camera
 * @returns {Camera}
 */
function get(req, res) {
  return res.json(req.camera);
}

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
function create(req, res, next) {
  const camera = new Camera({
    name: req.body.name,
    type: req.body.type,
    publicDomain: req.body.publicDomain,
    privateIp: req.body.privateIp,
    pwd: req.body.pwd,
    user: req.body.user,
    ioAlarm: req.body.ioAlarm,
    isOnline: req.body.isOnline,
    wsStreamUrl: req.body.wsStreamUrl
  });

  camera
    .save()
    .then(savedCamera => res.json(savedCamera))
    .catch(e => next(e));
}

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
function update(req, res, next) {
  const camera = {};
  camera.name = req.body.name;
  camera.type = req.body.type;
  camera.publicDomain = req.body.publicDomain;
  camera.privateIp = req.body.privateIp;
  camera.pwd = req.body.pwd;
  camera.user = req.body.user;
  camera.ioAlarm = req.body.ioAlarm;
  camera.isOnline = req.body.isOnline;
  camera.wsStreamUrl = req.body.wsStreamUrl;

  // camera
  //   .save()
  //   .then(savedCamera => res.json(savedCamera))
  //   .catch(e => next(e));
  Camera.update({ _id: req.camera.id }, { $set: camera }, (error, savedCamera) => {
    if (error) {
      next(error);
    }
    res.json({ success: true });
  });
}

/**
 * Get camera list.
 * @property {number} req.query.skip - Number of cameras to be skipped.
 * @property {number} req.query.limit - Limit number of cameras to be returned.
 * @returns {Camera[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Camera.list({ limit, skip })
    .then(cameras => res.json(cameras))
    .catch(e => next(e));
}

/**
 * Delete camera.
 * @returns {Camera}
 */
function remove(req, res, next) {
  const camera = req.camera;
  camera
    .remove()
    .then(deletedCam => res.json(deletedCam))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
