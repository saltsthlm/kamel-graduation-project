`use strict`;
const request = require('supertest');
const { app } = require('../src/app');

describe('The home route', () => {
  it('should respond to GET with status 200', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
});

describe('The loggin route', () => {
  it('should respond to POST with status 200', (done) => {
    request(app)
      .post('/login')
      .expect(200)
      .end(done);
  });
});