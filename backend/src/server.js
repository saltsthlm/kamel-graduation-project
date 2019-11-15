const app = require('./app');

const PORT = (process.env.NODE_ENV === 'production')
  ? process.env.PROD_PORT
  : process.env.DEV_PORT;

// eslint-disable-next-line no-console
console.log(`start backend on port ${PORT} at ${new Date().toLocaleTimeString()}`);

app.listen(PORT);
