`use strict`;
const express = require('express');
const expressWs = require('express-ws');
const morgan = require('morgan');
const helmet = require('helmet');
const uuid = require('uuid/v4');
const nameGenerator = require('project-name-generator');
const sockets = require('./controllers/sockets');
const clients = require('./clients/clients');
const logger = require('./logging/logging');

const wsInstance = expressWs(express());
const { app } = wsInstance;

app.use(helmet());
app.use(morgan('tiny', { stream: logger.stream }));

wsInstance.getWss().on('connection', sockets.onConnect);

app.ws('/socket/:id', (ws, req) => {
  ws.on('message', sockets.onMessage);
  ws.on('close', () => sockets.onClose(req));
});

app.get('/login', (req, res) => {
  res.redirect('../');
});

app.get('/', (req, res) => res.send('Hi'));

const getRandomLanguage = () => {
  const languages = ['ca', 'de', 'sv', 'fr'];
  return languages[Math.floor(Math.random() * languages.length)];
};

app.post('/login', (req, res) => {
  const credentials = {
    userId: uuid(),
    userName: nameGenerator().spaced,
    language: getRandomLanguage(),
  };
  clients.loggedInUsers.push(credentials);
  res.json(credentials);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.logger.error(err);
  req.session.spotifyCode = undefined;
  res.status(500).send('An Error Occured');
});

module.exports = {
  app,
};
