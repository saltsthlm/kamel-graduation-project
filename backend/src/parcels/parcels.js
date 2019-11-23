const { translate } = require('../translate/translation');
const clients = require('../clients/clients');
const { logger } = require('../logging/logging');

const deliverParcel = (parcel) => {
  const { ws } = clients.connectedClients.find((client) => (
    client.clientId === parcel.receiverId
  ));
  ws.send(JSON.stringify(parcel));
};

const deliverToAll = (parcel) => {
  clients.connectedClients.forEach((client) => deliverParcel({
    ...parcel,
    receiverId: client.clientId,
  }));
};

const newContactListParcel = () => ({
  type: 'UPDATE CONTACTLIST',
  connectedClients: clients.connectedClients.map((client) => ({
    userId: client.clientId,
    userName: client.clientName,
    language: client.language,
  })),
});

const sendPing = () => {
  const parcel = {
    type: 'SEND PING',
  };
  deliverToAll(parcel);
};

const sendConnected = () => {
  const parcel = newContactListParcel();
  console.log('updating', parcel.connectedClients.length);
  deliverToAll(parcel);
};

const processDirectMessage = async (parcel) => {
  let translatedMessage;
  let translated;
  try {
    translatedMessage = await translate(
      parcel.message,
      clients.getUserLanguageById(parcel.receiverId),
    );
    translated = true;
  } catch (error) {
    logger.error(error);
    logger.error(parcel);
    translated = false;
  }
  deliverParcel({
    ...parcel,
    translatedMessage,
    translated,
    senderLanguage: clients.getUserLanguageById(parcel.senderId),
    receiverLanguage: clients.getUserLanguageById(parcel.receiverId),
  });
};

const processContactListUpdate = (parcel) => {
  deliverParcel({
    ...newContactListParcel(),
    receiverId: parcel.senderId,
  });
};

const processWebRtcOffer = (parcel) => {
  deliverParcel(parcel);
};

const process = async (parcel) => {
  switch (parcel.type) {
  case 'DIRECT MESSAGE':
    return processDirectMessage(parcel);
  case 'OFFER WEBRTC':
    return processWebRtcOffer(parcel);
  case 'REPORT SUCCESS':
    return logger.info(parcel);
  case 'RETURN PONG':
    // return logger.debug(parcel);
    break;
  case 'UPDATE CONTACTS':
    return processContactListUpdate(parcel);
  default:
    return logger.info(`received parcel of unknown type "${parcel.type}"`);
  }
};

module.exports = {
  process,
  newContactListParcel,
  sendConnected,
  sendPing,
};
