import bcrypt from 'bcrypt';
import User from './user.model';

const saltRounds = 14;

export const getUserByCredentials = (username, password) => {
  return User.findOne({ username })
    .then(async user => {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return user;
      }
      return false;
    })
    .catch(err => Promise.reject(err));
};

/**
 * Load user and append to req.
 */
export const load = (req, res, next, id) => {
  User.get(id)
    .then(user => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
};

/**
 * Get user
 * @returns {User}
 */
export const get = (req, res) => {
  return res.json(req.user);
};

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @returns {User}
 */
export const create = (req, res, next) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const user = new User({
      username: req.body.username,
      password: hash,
    });

    user
      .save()
      .then(savedUser => res.json(savedUser))
      .catch(e => next(e));
  });
};

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
export const update = (req, res, next) => {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user
    .save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
};

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
export const list = (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
};

/**
 * Delete user.
 * @returns {User}
 */
export const remove = (req, res, next) => {
  const user = req.user;
  user
    .remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
};
