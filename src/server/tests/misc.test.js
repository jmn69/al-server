import httpStatus from 'http-status';
import request from 'supertest-as-promised';
import app from '../../index';

jest.mock('../middleware/authenticate', () => (req, res, next) => next());

describe('## Misc', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', done => {
      request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.text).toEqual('OK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/404', () => {
    it('should return 404 status', done => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).toEqual('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', done => {
      request(app)
        .get('/api/users/56z787zzz67fc')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(res => {
          expect(res.body.message).toEqual('Internal Server Error');
          done();
        })
        .catch(done);
    });

    it('should handle express validation error - username is required', done => {
      request(app)
        .post('/api/users')
        .send({
          password: '1234567890',
        })
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.message).toEqual('"username" is required');
          done();
        })
        .catch(done);
    });
  });
});
