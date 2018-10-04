
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthClientSchema = new Schema({
  name: String,
  client_id: String,
  client_secret: String,
  redirect_uri: String,
  grant_types: String,
  scope: String,
  User: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('OAuthClient', OAuthClientSchema);
