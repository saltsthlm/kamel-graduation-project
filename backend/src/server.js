'use strict';
const { app } = require('./app');

const PORT = (process.env.NODE_ENV === 'production')
  ? process.env.PROD_PORT
  : 8888;

app.listen(PORT);

// eslint-disable-next-line no-console
console.log(`Started backend on port ${PORT} at ${new Date().toLocaleTimeString()}`);
