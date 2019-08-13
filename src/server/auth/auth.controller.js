import jwt from 'jsonwebtoken';
import authModel from './auth.model';
import { getUserByCredentials } from '../user/user.controller';
import config from '../../config/config';

export const login = async (req, res, next) => {
  const postData = req.body;
  let user = null;
  try {
    user = await getUserByCredentials(postData.username, postData.password);
  }
 catch (err) {
    res.status(404).send(err);
  }
  if (user) {
    const accessToken = jwt.sign(
      user.toJSON(),
      config.accessSecret + user.password + user.lastLogOut,
      {
        expiresIn: config.tokenLife,
      }
    );
    const accessTokenExpires = new Date().setSeconds(
      new Date().getSeconds() + config.tokenLife
    );
    const refreshToken = jwt.sign(
      user.toJSON(),
      config.refreshSecret + user.password + user.lastLogOut,
      {
        expiresIn: config.refreshTokenLife,
      }
    );

    const tokenLifeInHour = config.refreshTokenLife / 24 / 60 / 60;
    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(
      refreshTokenExpires.getDate() + tokenLifeInHour
    );

    const response = {
      accessToken,
      refreshToken,
      id: user._id,
      username: user.username,
    };
    const newAccessTokenModel = new authModel.AccessToken({
      access_token: accessToken,
      expires: accessTokenExpires,
      user: user._id,
    });
    newAccessTokenModel.save().catch(e => next(e));

    const newRefreshTokenModel = new authModel.RefreshToken({
      refresh_token: refreshToken,
      expires: refreshTokenExpires,
      user: user._id,
    });
    newRefreshTokenModel.save().catch(e => next(e));

    res.status(200).json(response);
  }
 else {
    res.status(404).send('Resource not found');
  }
};

export const token = async (req, res, next) => {
  const postData = req.body;
  let refreshTokenList = [];
  try {
    refreshTokenList = await authModel.RefreshToken.list();
  }
 catch (err) {
    res.status(500).send(err);
  }

  const olRefreshToken = refreshTokenList.find(
    refreshToken => refreshToken.refresh_token === postData.refreshToken
  );

  if (postData.refreshToken) {
    if (
      olRefreshToken &&
      new Date().getTime() < new Date(olRefreshToken.expires).getTime()
    ) {
      const accessToken = jwt.sign(
        olRefreshToken.user.toJSON(),
        config.accessSecret +
          olRefreshToken.user.password +
          olRefreshToken.user.lastLogOut,
        {
          expiresIn: config.tokenLife,
        }
      );
      const accessTokenExpires = new Date().setSeconds(
        new Date().getSeconds() + config.tokenLife
      );
      const refreshToken = jwt.sign(
        olRefreshToken.user.toJSON(),
        config.refreshSecret +
          olRefreshToken.user.password +
          olRefreshToken.user.lastLogOut,
        {
          expiresIn: config.refreshTokenLife,
        }
      );

      const tokenLifeInHour = config.refreshTokenLife / 24 / 60 / 60;
      const refreshTokenExpires = new Date();
      refreshTokenExpires.setDate(
        refreshTokenExpires.getDate() + tokenLifeInHour
      );
      const response = {
        accessToken,
        refreshToken,
      };
      const newAccessTokenModel = new authModel.AccessToken({
        access_token: accessToken,
        expires: accessTokenExpires,
        user: olRefreshToken.user._id,
      });
      newAccessTokenModel.save().catch(e => next(e));

      const newRefreshTokenModel = new authModel.RefreshToken({
        refresh_token: refreshToken,
        expires: refreshTokenExpires,
        user: olRefreshToken.user._id,
      });
      newRefreshTokenModel.save().catch(e => next(e));
      res.status(200).json(response);
    }
 else {
      res.status(401).json({ error: true, message: 'Unauthorized access.' });
    }
  }
 else {
    res.status(404).send('Invalid request');
  }
};
