const express = require('express');
const expressWs = require('express-ws');

const wsInstance = expressWs(express());
const { app } = wsInstance;

const connectedClients = [];

const addConnectedClient = (clientId) => {
  connectedClients.push(clientId);
};

const removeConnectedClient = (clientId) => {
  connectedClients.splice(connectedClients.indexOf(clientId), 1);
};

const communicateConnectedClients = () => {
  const { clients } = wsInstance.getWss('/socket');
  clients.forEach((client) => client.send(JSON.stringify({ connectedClients })));
};

wsInstance.getWss().on('connection', (ws, req) => {
  req.id = req.params.id;
  addConnectedClient(req.params.id);
  communicateConnectedClients();
});

app.ws('/socket/:id', (ws) => {
  ws.on('message', (data) => {
    console.log(JSON.parse(data));
  });

  ws.on('close', (req) => {
    removeConnectedClient(req.id);
    communicateConnectedClients();
  });
});

app.get('/', (req, res) => res.send('Hi'));

module.exports = app;
