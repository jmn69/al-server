import Promise from 'bluebird';
import Mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Camera Schema
 */
const CameraSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    publicDomain: {
      type: String,
      required: true,
    },
    privateIp: {
      type: String,
      required: false,
    },
    pwd: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    wsStreamUrl: {
      type: String,
      required: false,
    },
    ioAlarm: {
      type: Number,
      required: false,
    },
    isOnline: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
CameraSchema.method({});

/**
 * Statics
 */
CameraSchema.statics = {
  /**
   * Get camera
   * @param {ObjectId} id - The objectId of camera.
   * @returns {Promise<Camera, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then(camera => {
        if (camera) {
          return camera;
        }
        const err = new APIError(
          'No such camera exists!',
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },

  /**
   * List camera in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of cameras to be skipped.
   * @param {number} limit - Limit number of cameras to be returned.
   * @returns {Promise<Camera[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

/**
 * @typedef Camera
 */
export default Mongoose.model('Camera', CameraSchema);