`use strict`;
const request = require('supertest');
const { app } = require('../src/app');

describe('The loggin route', () => {
  it('should respond to POST with status 200', (done) => {
    request(app)
      .post('/login')
      .expect(200)
      .end(done);
  });
});
