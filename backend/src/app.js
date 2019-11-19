const express = require('express');
const expressWs = require('express-ws');

const wsInstance = expressWs(express());
const { app } = wsInstance;

let connectedClients = [];

const addConnectedClient = (clientId, ws) => {
  connectedClients.push({
    clientId,
    ws,
  });
};

const removeConnectedClient = (clientId) => {
  connectedClients = connectedClients.filter((client) => client.clientId !== clientId);
};

const deliverParcel = (parcel) => {
  const { ws } = connectedClients.find((client) => client.clientId === parcel.receiverId);
  ws.send(JSON.stringify(parcel));
};

const communicateConnectedClients = () => {
  const parcel = {
    type: 'UPDATE CONTACTLIST',
    connectedClients: connectedClients.map((client) => client.clientId),
  };
  connectedClients.forEach((client) => deliverParcel({ ...parcel, receiverId: client.clientId }));
};

wsInstance.getWss().on('connection', (ws, req) => {
  req.id = req.params.id;
  addConnectedClient(req.id, ws);
  communicateConnectedClients();
});

app.ws('/socket/:id', (ws) => {
  ws.on('message', (data) => {
    const parcel = JSON.parse(data);
    if (parcel.type === 'DIRECT MESSAGE') {
      deliverParcel(parcel);
    }
    console.log(JSON.parse(data));
  });

  ws.on('close', (req) => {
    removeConnectedClient(req.id);
    communicateConnectedClients();
  });
});

app.get('/', (req, res) => res.send('Hi'));

module.exports = app;
