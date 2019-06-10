import Mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const Schema = Mongoose.Schema;

const RefreshTokenSchema = new Schema({
  refresh_token: String,
  expires: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
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
  },
};

const RefreshToken = Mongoose.model('RefreshToken', RefreshTokenSchema);

const AccessTokenSchema = new Schema({
  access_token: String,
  expires: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
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
      .then(accessTokenFromDb => {
        if (accessTokenFromDb) {
          return accessTokenFromDb;
        }
        const err = new APIError(
          'No such accessToken exists!',
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },
};

const AccessToken = Mongoose.model('AccessToken', AccessTokenSchema);

export default { RefreshToken, AccessToken };
