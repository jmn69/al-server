const jwt = require('jsonwebtoken');
const authModel = require('./auth.model');
const userCtrl = require('../user/user.controller');
const config = require('../../config/config');

async function login(req, res, next) {
  const postData = req.body;
  var user = null;
  try {
    user = await userCtrl.getUserByCredentials(postData.username, postData.password);
  } catch (err) {
    res.status(500).send(err);
  }
  if (user) {
    const accessToken = jwt.sign(user, config.accessSecret, { expiresIn: config.tokenLife });
    const accessTokenExpires = new Date().setSeconds(new Date().getSeconds() + config.tokenLife);
    const refreshToken = jwt.sign(user, config.refreshSecret, {
      expiresIn: config.refreshTokenLife
    });
    clearOldRefreshTokens(user._id, res);
    const refreshTokenExpires = new Date().setSeconds(
      new Date().getSeconds() + config.refreshTokenLife
    );
    const response = {
      status: 'Logged in',
      accessToken,
      refreshToken
    };
    const newAccessTokenModel = new authModel.AccessToken({
      access_token: accessToken,
      expires: accessTokenExpires,
      user: user._id
    });
    newAccessTokenModel.save().catch(e => next(e));

    const newRefreshTokenModel = new authModel.RefreshToken({
      refresh_token: refreshToken,
      expires: refreshTokenExpires,
      user: user._id
    });
    newRefreshTokenModel.save().catch(e => next(e));

    res.status(200).json(response);
  } else {
    res.status(401).send('Unauthorized');
  }
}

async function clearOldRefreshTokens(userId, res) {
  try {
    const allTokensList = await authModel.RefreshToken.list();
    allTokensList.forEach(async refreshToken => {
      if (new String(refreshToken.user._id).valueOf() === new String(userId).valueOf()) {
        await refreshToken.remove();
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
}

async function token(req, res, next) {
  const postData = req.body;
  var refreshTokenList = [];
  try {
    refreshTokenList = await authModel.RefreshToken.list();
  } catch (err) {
    res.status(500).send(err);
  }

  const olRefreshToken = refreshTokenList.find(
    refreshToken => refreshToken.refresh_token === postData.refreshToken
  );

  if (postData.refreshToken) {
    if (olRefreshToken && new Date().getTime() < new Date(olRefreshToken.expires).getTime()) {
      const accessToken = jwt.sign(olRefreshToken.user, config.accessSecret, {
        expiresIn: config.tokenLife
      });
      const accessTokenExpires = new Date().setSeconds(new Date().getSeconds() + config.tokenLife);
      const refreshToken = jwt.sign(olRefreshToken.user, config.refreshSecret, {
        expiresIn: config.refreshTokenLife
      });

      clearOldRefreshTokens(olRefreshToken.user._id, res);
      const refreshTokenExpires = new Date().setSeconds(
        new Date().getSeconds() + config.refreshTokenLife
      );
      const response = {
        status: 'Token refresh',
        accessToken,
        refreshToken
      };
      const newAccessTokenModel = new authModel.AccessToken({
        access_token: accessToken,
        expires: accessTokenExpires,
        user: olRefreshToken.user._id
      });
      newAccessTokenModel.save().catch(e => next(e));

      const newRefreshTokenModel = new authModel.RefreshToken({
        refresh_token: refreshToken,
        expires: refreshTokenExpires,
        user: olRefreshToken.user._id
      });
      newRefreshTokenModel.save().catch(e => next(e));
      res.status(200).json(response);
    } else {
      res.status(401).json({ error: true, message: 'Unauthorized access.' });
    }
  } else {
    res.status(404).send('Invalid request');
  }
}

module.exports = { login, token };
