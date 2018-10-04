const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string()
        .regex(/^[1-9][0-9]{9}$/)
        .required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string()
        .regex(/^[1-9][0-9]{9}$/)
        .required()
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
      userId: Joi.string()
        .hex()
        .required()
    }
  }
};
