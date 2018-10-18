const mongoose = require('mongoose');

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
  User: { type: Schema.Types.ObjectId, ref: 'User' }
});

const AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = { RefreshToken, AccessToken };
