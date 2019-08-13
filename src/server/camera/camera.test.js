import Mongoose from 'mongoose';
import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import app from '../../index';

jest.mock('../middleware/authenticate', () => (req, res, next) => next());

afterAll(done => {
  Mongoose.models = {};
  Mongoose.modelSchemas = {};
  Mongoose.connection.close();
  done();
});

describe('## Camera APIs', () => {
  let camera = {
    name: 'Garage',
    type: 1,
    publicDomain: '10.4.34.6',
    privateIp: '192.168.1.3',
    httpsPort: '443',
    rtspPort: '4666',
    pwd: 'admin',
    user: 'admin',
    isOnline: true,
    wsStreamUrl: 'ws://localhost:9995',
  };

  describe('# POST /api/cameras', () => {
    it('should create a new camera', done => {
      request(app)
        .post('/api/cameras')
        .send(camera)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.name).toEqual(camera.name);
          expect(res.body.type).toEqual(camera.type);
          expect(res.body.publicDomain).toEqual(camera.publicDomain);
          expect(res.body.rtspPort).toEqual(camera.rtspPort);
          expect(res.body.httpsPort).toEqual(camera.httpsPort);
          expect(res.body.privateIp).toEqual(camera.privateIp);
          expect(res.body.pwd).toEqual(camera.pwd);
          expect(res.body.user).toEqual(camera.user);
          expect(res.body.isOnline).toEqual(camera.isOnline);
          expect(res.body.wsStreamUrl).toEqual(camera.wsStreamUrl);
          camera = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/cameras/:cameraId', () => {
    it('should get camera details', done => {
      request(app)
        .get(`/api/cameras/${camera._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.name).toEqual(camera.name);
          expect(res.body.type).toEqual(camera.type);
          expect(res.body.publicDomain).toEqual(camera.publicDomain);
          expect(res.body.rtspPort).toEqual(camera.rtspPort);
          expect(res.body.httpsPort).toEqual(camera.httpsPort);
          expect(res.body.privateIp).toEqual(camera.privateIp);
          expect(res.body.pwd).toEqual(camera.pwd);
          expect(res.body.user).toEqual(camera.user);
          expect(res.body.isOnline).toEqual(camera.isOnline);
          expect(res.body.wsStreamUrl).toEqual(camera.wsStreamUrl);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when camera does not exists', done => {
      request(app)
        .get('/api/cameras/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).toEqual('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/cameras/:cameraId', () => {
    it('should update camera details', done => {
      camera.name = 'Garage';
      request(app)
        .put(`/api/cameras/${camera._id}`)
        .send(camera)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.success).toEqual(true);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/cameras/', () => {
    it('should get all cameras', done => {
      request(app)
        .get('/api/cameras')
        .expect(httpStatus.OK)
        .then(res => {
          expect(Array.isArray(res.body)).toBe(true);
          done();
        })
        .catch(done);
    });

    it('should get all cameras (with limit and skip)', done => {
      request(app)
        .get('/api/cameras')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then(res => {
          expect(Array.isArray(res.body)).toBe(true);
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/cameras/', () => {
    it('should delete camera', done => {
      request(app)
        .delete(`/api/cameras/${camera._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.name).toEqual('Garage');
          done();
        })
        .catch(done);
    });
  });
});
