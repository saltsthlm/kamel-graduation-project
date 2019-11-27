'use strict';
const { translate } = require('../translate/translation');
const clients = require('../clients/clients');
const { logger } = require('../logging/logging');
const User = require('../mongodb/schemas');

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

// Moritz's Messages Database Object
// const messages = {
//   'Ariadna_databaseId': [parcel1, parcel2],
//   'Erik_databaseId': [parcel1, parcel2],
// }

const updateChatMessages = (messages, parcel, senderId = parcel.senderId) => {
  const senderMessages = (messages[senderId])
    ? [...messages[senderId], parcel]
    : [parcel];

  return {
    ...messages,
    [senderId]: senderMessages,
  };
};

const saveToDatabase = (dbParcel) => {
  const { senderId, receiverId } = dbParcel;
  const sender = clients.loggedInUsers.find((user) => user.userId === senderId);
  const receiver = clients.loggedInUsers.find((user) => user.userId === receiverId);

  const databaseIdSender = sender.databaseId;
  const databaseIdReceiver = receiver.databaseId;

  // Moritz sent a message to Ariadna
  User.findById(databaseIdSender, (err, user) => {
    if (err || !user) {
      logger.error(err);
    }
    const { messages } = user;
    const updatedMessages = updateChatMessages(messages, dbParcel, receiver.userName);
    User.updateOne({ _id: databaseIdSender }, { '$set': { messages: updatedMessages } }, (err) => {
      logger.error(err);
    });
    logger.info('updated messages');
  });

  User.findById(databaseIdReceiver, (err, user) => {
    if (err || !user) {
      logger.error(err);
    }
    const { messages } = user;
    const updatedMessages = updateChatMessages(messages, dbParcel, sender.userName);
    User.updateOne({ _id: databaseIdReceiver }, { '$set': { messages: updatedMessages } }, (err) => {
      logger.error(err);
    });
    logger.info('updated messages');

  });
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
    const dbParcel = {
      ...parcel,
      translatedMessage,
      translated,
      userName: parcel.userName,
      senderLanguage: clients.getUserLanguageById(parcel.senderId),
      receiverLanguage: clients.getUserLanguageById(parcel.receiverId),
    };
    saveToDatabase(dbParcel);
    deliverParcel(dbParcel);
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
    userName: clients.getUserNameById(parcel.senderId),
    language: clients.getUserLanguageById(parcel.senderId),
  };
  deliverParcel({ ...parcel, chatPartner });
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
    case 'REJECT CALL':
      return deliverParcel(parcel);
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
