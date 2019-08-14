import AWS from 'aws-sdk';
import Alert from './alert.model';
import config from '../../config/config';

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.accessSecretKey,
  region: 'eu-west-3',
  signatureVersion: 'v4',
});

/**
 * Load alert and append to req.
 */
export const load = (req, res, next, id) => {
  Alert.get(id)
    .then(alert => {
      req.alert = alert; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
};

/**
 * Get Alert
 * @returns {Alert}
 */
export const get = (req, res) => {
  return res.json(req.alert);
};

/**
 * Get alert list.
 * @property {number} req.query.skip - Number of alert to be skipped.
 * @property {number} req.query.limit - Limit number of alert to be returned.
 * @returns {Alert[]}
 */
export const list = (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  Alert.list({ limit, skip })
    .then(alerts => res.json(alerts))
    .catch(e => next(e));
};

/**
 * Get the S3 image
 * @returns {Stream}
 */
export const getS3Image = (req, res, next) => {
  s3.getObject(
    {
      Bucket: req.alert.image.bucket,
      Key: req.alert.image.key,
    },
    (err, data) => {
      if (err) {
        return res.send({ error: err });
      }

      res.set('Cache-Control', 'public, max-age=31557600');
      res.send(data.Body);
    }
  );
};

/**
 * Get the S3 video
 * @returns {Stream}
 */
export const getS3Video = (req, res, next) => {
  s3.getObject(
    {
      Bucket: req.alert.video.bucket,
      Key: req.alert.video.key,
    },
    (err, data) => {
      if (err) {
        return res.send({ error: err });
      }

      res.set('Cache-Control', 'public, max-age=31557600');
      res.send(data.Body);
    }
  );
};
