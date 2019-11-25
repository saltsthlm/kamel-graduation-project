const mongoose = require('mongoose');
const { logger } = require('../logging/logging');

// const session = require('express-session');
// const mongoStore = require('connect-mongo')(session);

const setupDb = () => {
  mongoose.set('useCreateIndex', true);
  mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-yc07r.gcp.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );
  const db = mongoose.connection;
  db.on('error', (err) => logger.error(err));
  db.once('open', () => logger.info('connected to mongo db'));
  return db;
};

module.exports = { setupDb };
