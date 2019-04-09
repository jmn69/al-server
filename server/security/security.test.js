jest.mock('../middleware/authenticate', () => (req, res, next) => next());
const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const app = require('../../index');

afterAll((done) => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
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
    it('should get the security mod', (done) => {
      request(app)
        .get('/api/security')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.lock).toEqual(true);
          done();
        })
        .catch(done);
    });
  });
});
