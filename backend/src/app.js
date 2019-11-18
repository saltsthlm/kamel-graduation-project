const express = require('express');
const expressWs = require('express-ws');

// create an express-websocket instance that will wrap the express app
const wsInstance = expressWs(express());
// `app` can be used like in any other express app from here on
const { app } = wsInstance;

// helper function to format a string message, not so important
const newClientRegistered = (clientId) => {
  const time = new Date().toLocaleTimeString();
  return JSON.stringify({
    message: `client width id ${clientId} registered at ${time}`,
  });
};

// this block will run every time a new socket connection is opened
wsInstance.getWss().on('connection', (ws, req) => {
  // send a welcome message to the client
  ws.send(JSON.stringify({
    message: `Welcome to Socket ${req.params.id}`,
  }));
  // send message to all connected clients saying that new client connected
  const { clients } = wsInstance.getWss('/socket');
  clients.forEach((client) => client.send(newClientRegistered(req.params.id)));
});

// this block will run every time data is sent through the socket connection,
// execept for when the connection is opened (see above)
app.ws('/socket/:id', (ws, req) => {
  ws.on('message', (data) => {
    console.log(JSON.parse(data));
  });
});

// just to make our sample unit test pass
app.get('/', (req, res) => res.send('Hi'));

module.exports = app;
