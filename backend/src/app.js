const express = require('express');
const expressWs = require('express-ws');

const wsInstance = expressWs(express());
const { app } = wsInstance;

const getWsClients = (route) => wsInstance.getWss(route).clients;

app.ws('/socket/:id', (ws, req) => {
  ws.on('message', () => {
    ws.send(`Welcome to Socket ${req.params.id}`);

    const clients = getWsClients(req.url);
    const time = new Date().toLocaleTimeString();
    clients.forEach((client) => client.send(`New client registered at ${time}`));
  });
});

module.exports = app;
