'use strict';
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
  type: 'UPDATE CONTACTS',
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
  } finally {
    deliverParcel({
      ...parcel,
      translatedMessage,
      translated,
      senderLanguage: clients.getUserLanguageById(parcel.senderId),
      receiverLanguage: clients.getUserLanguageById(parcel.receiverId),
    });
  }
};

const processContactListUpdate = (parcel) => {
  deliverParcel({
    ...newContactListParcel(),
    receiverId: parcel.senderId,
  });
};

const processVideoOffer = (parcel) => {
  const chatPartner = {
    userId: parcel.senderId,
    userName: clients.getUserLanguageById(parcel.senderId),
    language: clients.getUserNameById(parcel.senderId),
  }
  deliverParcel({...parcel, chatPartner });
};

const process = async (parcel) => {
  switch (parcel.type) {
    case 'DIRECT MESSAGE':
      return processDirectMessage(parcel);
    case 'OFFER VIDEO':
      return processVideoOffer(parcel);
    case 'REPORT SUCCESS':
      return logger.info(parcel);
    case 'REPORT LANGUAGE':
      return logger.info(`${parcel.senderId} browser language is "${parcel.message}"`); // Placeholder
    case 'RETURN PONG':
      return logger.debug(parcel);
    case 'TRANSLATE SUBTITLES':
      return processDirectMessage(parcel);
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
