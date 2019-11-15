const request = require('supertest');
const app = require('../src/app');

describe('The home route', () => {
  it('should respond to GET with status 200', () => {
    request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect(200);
  });
});