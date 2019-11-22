`use strict`;
const client = require('../clients/clients');
const { logger } = require('../logging/logging');
const { processParcel } = require('./parcels');

const onConnect = (ws, req) => {
  req.id = req.params.id;
  client.addConnected(req.params.id, ws);
  client.communicateConnected();
  logger.info(`opened connection on socket ${req.id}`);
};

const onClose = (req) => {
  client.removeConnected(req.id);
  client.communicateConnected();
  logger.info(`closed connection on socket ${req.id}`);
};

const onMessage = async (data) => {
  logger.info(`data recieved, processing...`);
  try {
    return await processParcel(await JSON.parse(await data));
  } catch (error) {
    console.dir(data);
    throw error;
  }
};

module.exports = {
  onClose,
  onMessage,
  onConnect,
};
