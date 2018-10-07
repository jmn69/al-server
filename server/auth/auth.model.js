let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
   * List still valid refreshTokens
   * @returns {Promise<RefresToken[]>}
   */
  listValidTokens() {
    return this.find()
      .populate('user')
      .where('expires')
      .gt(new Date())
      .exec();
  },

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
