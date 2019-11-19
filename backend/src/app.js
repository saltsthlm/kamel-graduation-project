const express = require('express');
const expressWs = require('express-ws');
const { translate } = require('./translate/translation');
const client = require('./clientManagement/clientHandler');


const wsInstance = expressWs(express());
const { app } = wsInstance;


wsInstance.getWss().on('connection', (ws, req) => {
  req.id = req.params.id;
  client.addConnectedClient(req.id, ws);
  client.communicateConnectedClients();
});

app.ws('/socket/:id', (ws) => {
  ws.on('message', async (data) => {
    const parcel = JSON.parse(data);
    if (parcel.type === 'DIRECT MESSAGE') {
      const translatedMessage = await translate(parcel.message, 'sv');
      client.deliverParcel({ ...parcel, translatedMessage });
    }
    console.log(JSON.parse(data));
  });

  ws.on('close', (req) => {
    client.removeConnectedClient(req.id);
    client.communicateConnectedClients();
  });
});

app.get('/', (req, res) => res.send('Hi'));

module.exports = app;
