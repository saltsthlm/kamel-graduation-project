const express = require('express');
const expressWs = require('express-ws');

const sockets = require('./controllers/sockets');

const wsInstance = expressWs(express());
const { app } = wsInstance;

wsInstance.getWss().on('connection', sockets.onConnect);

app.ws('/socket/:id', (ws) => {
  ws.on('message', sockets.onMessage);
  ws.on('close', sockets.onClose);
});

app.get('/', (req, res) => res.send('Hi'));

module.exports = app;
