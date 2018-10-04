const oauthServer = require('oauth2-server');

const oauth = new oauthServer({
  model: require('./mongo-models.js')
});

module.exports = oauth;
