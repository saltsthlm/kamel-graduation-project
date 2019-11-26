'use strict';
const express = require('express');
const expressWs = require('express-ws');
const morgan = require('morgan');
const helmet = require('helmet');
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');

const sockets = require('./controllers/sockets');
const clients = require('./clients/clients');
const logger = require('./logging/logging');
const mongoClient = require('./mongodb/connect');
const parcels = require('./parcels/parcels');
const User = require('./mongodb/schemas');

const wsInstance = expressWs(express());
const { app } = wsInstance;
mongoClient.setupDb().then(() => {
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

  app.get('/register', (req, res) => {
    res.redirect('..');
  });

  app.post('/register', async (req, res) => {
    const { userName, password, language, email } = req.body;
    console.log(language);
    const credentials = {
      userName,
      password,
      language,
      email,
      socketId: uuid(),
    };

    const user = new User(credentials);
    await user.save((err, registeredUser) => {
      if (err) {
        logger.logger.error(err);
        return res.status(401).json({ error: 'email already in use' });
      }
      logger.logger.info('created new user');
      logger.logger.info(registeredUser);
      return res.status(200).json();
    });
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    await User.authenticate(email, password, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'wrong email or password' });
      }

      console.log(user);

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

  // redirect all invalid urls to home
  app.use((req, res) => {
    res.redirect('..');
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    logger.logger.error(err);
    res.status(500).send('An Error Occured');
  });
});


module.exports = {
  app,
};
