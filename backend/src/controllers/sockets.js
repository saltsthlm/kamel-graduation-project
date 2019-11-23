const client = require('../clients/clients');
const { translate } = require('../translate/translation');
const { logger } = require('../logging/logging');

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

const processParcel = async (parcel) => {
  if (parcel.type === 'DIRECT MESSAGE') {
    const translatedMessage = await translate(
      parcel.message,
      client.getUserLanguage(parcel.receiverId),
    );
    client.deliverParcel({
      ...parcel,
      translatedMessage,
      senderLanguage: client.getUserLanguage(parcel.senderId),
      receiverLanguage: client.getUserLanguage(parcel.receiverId),
    });
  }

  if (parcel.type === 'REQUEST CONTACT LIST UPDATE') {
    client.deliverParcel({
      ...client.newContactListParcel(),
      receiverId: parcel.senderId,
    });
  }
}

const onMessage = async (data) => {
  const parcel = JSON.parse(data);
  if (parcel.type) {
    logger.info(`received parcel of type ${parcel.type}`);
    await processParcel(parcel);
    logger.info(parcel);
    logger.info(`processed parcel of type ${parcel.type}`);
  }
};

module.exports = {
  onClose,
  onMessage,
  onConnect,
};
