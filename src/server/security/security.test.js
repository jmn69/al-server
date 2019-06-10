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

describe('## Security APIs', () => {
  // const security = {
  //   lock: true
  // };

  // describe('# POST /api/security', () => {
  //   it('should set the security mod', (done) => {
  //     request(app)
  //       .post('/api/security')
  //       .send(security)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.success).toEqual(true);
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  describe('# GET /api/security', () => {
    it('should get the security mod', done => {
      request(app)
        .get('/api/security')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.lock).toEqual(true);
          done();
        })
        .catch(done);
    });
  });
});
