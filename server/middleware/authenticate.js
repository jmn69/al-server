/* eslint-disable */

const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const authModel = require('../auth/auth.model');

module.exports = async (req, res, next) => {
  const token = req && (req.body.token || req.query.token || req.headers['x-access-token']);
  if (token) {
    try {
      const accessTokenInDb = await authModel.AccessToken.getByToken(token);
      jwt.verify(
        token,
        config.accessSecret + accessTokenInDb.user.password + accessTokenInDb.user.lastLogOut,
        (err, decoded) => {
          if (err) {
            return res.status(401).json({ error: true, message: 'Unauthorized access.' });
          }
          req.decoded = decoded;
          next();
        }
      );
    } catch (e) {
      return res.status(500).send({
        error: true,
        message: e
      });
    }
  } else {
    return res.status(403).send({
      error: true,
      message: 'No token provided.'
    });
  }
};
