/* eslint-disable */

const jwt = require('jsonwebtoken');
const config = require('../../config/config');

module.exports = (req, res, next) => {
  const token = req && (req.body.token || req.query.token || req.headers['x-access-token']);
  if (token) {
    jwt.verify(token, config.accessSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: true, message: 'Unauthorized access.' });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).send({
      error: true,
      message: 'No token provided.'
    });
  }
};
