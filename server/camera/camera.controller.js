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
 * @property {string} req.body.domain - The domain/ip of camera.
 * @property {string} req.body.pwd - The password of camera.
 * @property {string} req.body.user - The username of camera.
 * @property {string} req.body.wsStreamUrl - The webservice url of the camera stream mjpeg format.
 * @returns {Camera}
 */
function create(req, res, next) {
  const camera = new Camera({
    name: req.body.name,
    type: req.body.type,
    domain: req.body.domain,
    pwd: req.body.pwd,
    user: req.body.user,
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
 * @property {string} req.body.domain - The domain/ip of camera.
 * @property {string} req.body.pwd - The password of camera.
 * @property {string} req.body.user - The username of camera.
 * @property {string} req.body.wsStreamUrl - The webservice url of the camera stream.
 * @returns {Camera}
 */
function update(req, res, next) {
  const camera = req.camera;
  camera.name = req.body.name;
  camera.type = req.body.type;
  camera.domain = req.body.domain;
  camera.pwd = req.body.pwd;
  camera.user = req.body.user;
  camera.wsStreamUrl = req.body.wsStreamUrl;

  camera
    .save()
    .then(savedCamera => res.json(savedCamera))
    .catch(e => next(e));
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
