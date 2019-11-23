const client = require('../clients/clients');
const { logger } = require('../logging/logging');
const parcels = require('../parcels/parcels');

const onConnect = (ws, req) => {
  req.id = req.params.id;
  client.addConnected(req.params.id, ws);
  parcels.sendConnected();
  logger.info(`opened connection on socket ${req.id}`);
};

const onClose = (req) => {
  client.removeConnectionById(req.id);
  parcels.sendConnected();
  logger.info(`closed connection on socket ${req.id}`);
};

const onMessage = async (data) => {
  const parcel = JSON.parse(data);
  if (parcel.type) {
    logger.info(`received parcel of type ${parcel.type}`);
    await parcels.process(parcel);
    logger.info(parcel);
    logger.info(`processed parcel of type ${parcel.type}`);
  }
};

module.exports = {
  onClose,
  onMessage,
  onConnect,
};
