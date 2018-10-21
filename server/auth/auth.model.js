const mongoose = require('mongoose');
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');

const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
  refresh_token: String,
  expires: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

/**
 * Statics
 */
RefreshTokenSchema.statics = {
  /**
   * List refreshTokens
   * @returns {Promise<RefresToken[]>}
   */
  list() {
    return this.find()
      .populate('user')
      .exec();
  }
};

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

const AccessTokenSchema = new Schema({
  access_token: String,
  expires: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

/**
 * Statics
 */
AccessTokenSchema.statics = {
  /**
   * Get token
   * @param {String} accessToken - The token
   * @returns {Promise<AccessToken, APIError>}
   */
  getByToken(accessToken) {
    return this.findOne({ access_token: accessToken })
      .populate('user')
      .exec()
      .then((accessTokenFromDb) => {
        if (accessTokenFromDb) {
          return accessTokenFromDb;
        }
        const err = new APIError('No such accessToken exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

const AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = { RefreshToken, AccessToken };
