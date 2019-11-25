'use strict';
const express = require('express');
const expressWs = require('express-ws');
const morgan = require('morgan');
const helmet = require('helmet');
const uuid = require('uuid/v4');
const nameGenerator = require('project-name-generator');
const bodyParser = require('body-parser');

const sockets = require('./controllers/sockets');
const clients = require('./clients/clients');
const languages = require('./translate/languages');
const logger = require('./logging/logging');
const mongoClient = require('./mongodb/connect');
const parcels = require('./parcels/parcels');
const User = require('./mongodb/schemas');

const wsInstance = expressWs(express());
const { app } = wsInstance;
mongoClient.setupDb();

app.use(helmet());
app.use(morgan('tiny', { stream: logger.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setInterval(() => parcels.sendPing(), 5000);

wsInstance.getWss().on('connection', sockets.onConnect);

app.ws('/socket/:id', (ws, req) => {
  ws.on('message', sockets.onMessage);
  ws.on('close', () => sockets.onClose(req));
});

app.get('/login', (req, res) => {
  res.redirect('..');
});

app.post('/login', async (req, res) => {
  const { userName, password, email, language } = req.body;
  const credentials = {
    userName,
    password,
    language,
    email,
  };

  const user = new User(credentials);
  user.save((err, user) => {
    if (err) console.log(err);
    console.log('added user: ', user);
  });

  const userOld = { ...credentials, userId: uuid() };
  clients.loggedInUsers.push(userOld);
  res.json(userOld);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.logger.error(err);
  res.status(500).send('An Error Occured');
});

module.exports = {
  app,
};
