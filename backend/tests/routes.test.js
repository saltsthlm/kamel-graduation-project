const request = require('supertest');
const app = require('../src/app');

describe('The home route', () => {
  it('should respond to GET with status 200', async (done) => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    done();
  });
});