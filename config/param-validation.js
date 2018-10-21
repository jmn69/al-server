const Joi = require('joi');

module.exports = {
  // POST /api/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // POST /api/token
  token: {
    body: {
      refreshToken: Joi.string().required()
    }
  },

  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
      lastLogOut: Joi.date()
    },
    params: {
      userId: Joi.string()
        .hex()
        .required()
    }
  },

  // POST /api/cameras
  createCamera: {
    body: {
      name: Joi.string().required(),
      type: Joi.number().required(),
      domain: Joi.string().required(),
      pwd: Joi.string().required(),
      user: Joi.string().required(),
      wsStreamUrl: Joi.string().required()
    }
  },

  // UPDATE /api/cameras/:cameraId
  updateCamera: {
    body: {
      name: Joi.string().required(),
      type: Joi.number().required(),
      domain: Joi.string().required(),
      pwd: Joi.string().required(),
      user: Joi.string().required(),
      wsStreamUrl: Joi.string().required()
    },
    params: {
      cameraId: Joi.string()
        .hex()
        .required()
    }
  }
};
