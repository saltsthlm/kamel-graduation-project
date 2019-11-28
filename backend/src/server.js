'use strict';
const { app } = require('./app');

process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection', error.message);
});

const PORT = (process.env.NODE_ENV === 'production')
  ? process.env.PROD_PORT
  : 8888;

app.listen(PORT);

// eslint-disable-next-line no-console
console.log(`started backend on port ${PORT} at ${new Date().toLocaleTimeString()}`);
