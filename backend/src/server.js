const app = require('./app');

const PORT = (process.env.NODE_ENV === 'production')
  ? process.env.PROD_PORT
  : process.env.DEV_PORT;

app.listen(PORT);

// eslint-disable-next-line no-console
console.log(`started backend on port ${PORT} at ${new Date().toLocaleTimeString()}`);
