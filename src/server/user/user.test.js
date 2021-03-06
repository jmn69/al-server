import Mongoose from 'mongoose';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import bcrypt from 'bcrypt';
import app from '../../index';

jest.mock('../middleware/authenticate', () => (req, res, next) => next());

/**
 * root level hooks
 */
afterAll(done => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  Mongoose.models = {};
  Mongoose.modelSchemas = {};
  Mongoose.connection.close();
  done();
});

describe('## User APIs', () => {
  let user = {
    username: 'KK123',
    password: 'test',
  };

  describe('# POST /api/users', () => {
    it('should create a new user', done => {
      request(app)
        .post('/api/users')
        .send(user)
        .expect(httpStatus.OK)
        .then(async res => {
          expect(res.body.username).toEqual(user.username);
          const match = await bcrypt.compare(
            user.password,
            '$2b$14$4x5mDAm0WIFwswdsKSrS1eNiCKfwch41D0PbhNme95AFPgNp0UcOe'
          );
          expect(match).toEqual(true);
          user = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/:userId', () => {
    it('should get user details', done => {
      request(app)
        .get(`/api/users/${user._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.username).toEqual(user.username);
          expect(res.body.mobileNumber).toEqual(user.mobileNumber);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', done => {
      request(app)
        .get('/api/users/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).toEqual('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', done => {
      user.username = 'KK';
      request(app)
        .put(`/api/users/${user._id}`)
        .send(user)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.username).toEqual('KK');
          expect(res.body.mobileNumber).toEqual(user.mobileNumber);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/', () => {
    it('should get all users', done => {
      request(app)
        .get('/api/users')
        .expect(httpStatus.OK)
        .then(res => {
          expect(Array.isArray(res.body)).toBe(true);
          done();
        })
        .catch(done);
    });

    it('should get all users (with limit and skip)', done => {
      request(app)
        .get('/api/users')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then(res => {
          expect(Array.isArray(res.body)).toBe(true);
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/users/', () => {
    it('should delete user', done => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.username).toEqual('KK');
          expect(res.body.mobileNumber).toEqual(user.mobileNumber);
          done();
        })
        .catch(done);
    });
  });
});
