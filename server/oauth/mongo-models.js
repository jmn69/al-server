const _ = require('lodash');
const mongodb = require('./mongodb');
const User = require('../user/user.model');
const OAuthClient = mongodb.OAuthClient;
const OAuthAccessToken = mongodb.OAuthAccessToken;
const OAuthRefreshToken = mongodb.OAuthRefreshToken;

function getAccessToken(bearerToken) {
  console.log('getAccessToken', bearerToken);
  return (
    OAuthAccessToken
      // User,OAuthClient
      .findOne({ access_token: bearerToken })
      .populate('User')
      .populate('OAuthClient')
      .then((accessToken) => {
        console.log('at', accessToken);
        if (!accessToken) return false;
        const token = accessToken;
        token.user = token.User;
        token.client = token.OAuthClient;
        token.scope = token.scope;
        token.accessTokenExpiresAt = token.expires;
        return token;
      })
      .catch((err) => {
        console.log('getAccessToken - Err: ');
      })
  );
}

function getClient(clientId, clientSecret) {
  console.log('getClient', clientId, clientSecret);
  const options = { client_id: clientId };
  if (clientSecret) options.client_secret = clientSecret;

  return OAuthClient.findOne(options)
    .then((client) => {
      if (!client) return new Error('client not found');
      const clientWithGrants = client;
      clientWithGrants.grants = [
        'authorization_code',
        'password',
        'refresh_token',
        'client_credentials'
      ];
      // Todo: need to create another table for redirect URIs
      clientWithGrants.redirectUris = [clientWithGrants.redirect_uri];
      delete clientWithGrants.redirect_uri;
      // clientWithGrants.refreshTokenLifetime = integer optional
      // clientWithGrants.accessTokenLifetime  = integer optional
      return clientWithGrants;
    })
    .catch((err) => {
      console.log('getClient - Err: ', err);
    });
}

function getUser(username, password) {
  return User.findOne({ username })
    .then((user) => {
      console.log('u', user);
      return user.password === password ? user : false;
    })
    .catch((err) => {
      console.log('getUser - Err: ', err);
    });
}

function revokeToken(token) {
  console.log('revokeToken', token);
  return OAuthRefreshToken.findOne({
    where: {
      refresh_token: token.refreshToken
    }
  })
    .then((rT) => {
      if (rT) rT.destroy();
      /** *
       * As per the discussion we need set older date
       * revokeToken will expected return a boolean in future version
       * https://github.com/oauthjs/node-oauth2-server/pull/274
       * https://github.com/oauthjs/node-oauth2-server/issues/290
       */
      const expiredToken = token;
      expiredToken.refreshTokenExpiresAt = new Date('2015-05-28T06:59:53.000Z');
      return expiredToken;
    })
    .catch((err) => {
      console.log('revokeToken - Err: ', err);
    });
}

function saveToken(token, client, user) {
  console.log('saveToken', token, client, user);
  return Promise.all([
    OAuthAccessToken.create({
      access_token: token.accessToken,
      expires: token.accessTokenExpiresAt,
      OAuthClient: client._id,
      User: user._id,
      scope: token.scope
    }),
    token.refreshToken
      ? OAuthRefreshToken.create({
          // no refresh token for client_credentials
        refresh_token: token.refreshToken,
        expires: token.refreshTokenExpiresAt,
        OAuthClient: client._id,
        User: user._id,
        scope: token.scope
      })
      : []
  ])
    .then(resultsArray =>
      _.assign(
        // expected to return client and user, but not returning
        {
          client,
          user,
          access_token: token.accessToken, // proxy
          refresh_token: token.refreshToken // proxy
        },
        token
      )
    )
    .catch((err) => {
      console.log('revokeToken - Err: ', err);
    });
}

function getUserFromClient(client) {
  console.log('getUserFromClient', client);
  const options = { client_id: client.client_id };
  if (client.client_secret) options.client_secret = client.client_secret;

  return OAuthClient.findOne(options)
    .populate('User')
    .then((client) => {
      console.log(client);
      if (!client) return false;
      if (!client.User) return false;
      return client.User;
    })
    .catch((err) => {
      console.log('getUserFromClient - Err: ', err);
    });
}

function getRefreshToken(refreshToken) {
  console.log('getRefreshToken', refreshToken);
  if (!refreshToken || refreshToken === 'undefined') return false;
  // [OAuthClient, User]
  return OAuthRefreshToken.findOne({ refresh_token: refreshToken })
    .populate('User')
    .populate('OAuthClient')
    .then((savedRT) => {
      console.log('srt', savedRT);
      const tokenTemp = {
        user: savedRT ? savedRT.User : {},
        client: savedRT ? savedRT.OAuthClient : {},
        refreshTokenExpiresAt: savedRT ? new Date(savedRT.expires) : null,
        refreshToken,
        refresh_token: refreshToken,
        scope: savedRT.scope
      };
      return tokenTemp;
    })
    .catch((err) => {
      console.log('getRefreshToken - Err: ', err);
    });
}

module.exports = {
  getAccessToken,
  // getAuthorizationCode,
  getClient,
  getRefreshToken,
  getUser,
  getUserFromClient,
  // revokeAuthorizationCode,
  revokeToken,
  saveToken
  // saveAuthorizationCode
};
