

let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthAccessTokenSchema = new Schema({
  access_token: String,
  expires: Date,
  scope: String,
  User: { type: Schema.Types.ObjectId, ref: 'User' },
  OAuthClient: { type: Schema.Types.ObjectId, ref: 'OAuthClient' }
});

module.exports = mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema);
