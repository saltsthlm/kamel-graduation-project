const express = require('express');
const expressWs = require('express-ws');

const app = express();
expressWs(app);

app.get('/', (req, res) => res.send('Hi'));

app.ws('/', (ws, req) => {
  ws.on('message', (msg) => {
    ws.send(`Server: ${msg}`);
    setInterval(() => ws.send(`Server: ${new Date()}`), 1000);
  });
});

module.exports = app;
