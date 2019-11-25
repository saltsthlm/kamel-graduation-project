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

const registerUser = ({ userName, password, email, language }) => {
  const credentials = {
    userName,
    password,
    language,
    email,
    socketId: uuid(),
  };

  const user = new User(credentials);
  user.save((err, registeredUser) => {
    if (err) logger.logger.error(err);
    logger.logger.info(registeredUser);
  });
  return user;
};

app.post('/register', (req, res) => {
  registerUser(req.body);
  res.send();
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  await User.authenticate(email, password, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'error' });
    }

    const credentials = {
      userName: user.userName,
      language: user.language,
      email: user.email,
      userId: uuid(),
    };

    clients.loggedInUsers.push(credentials);
    return res.json(credentials);
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.logger.error(err);
  res.status(500).send('An Error Occured');
});

module.exports = {
  app,
};
