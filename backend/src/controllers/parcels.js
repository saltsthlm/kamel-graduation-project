`use strict`;
const client = require('../clients/clients');
const { translate } = require('../translate/translation');
const { logger } = require('../logging/logging');

const deliverTranslation = async (parcel) => {
  client.deliverParcel({
    ...parcel,
    translatedMessage: await translate(parcel.message, client.getUserLanguage(parcel.receiverId)),
    senderLanguage: client.getUserLanguage(parcel.senderId),
    receiverLanguage: client.getUserLanguage(parcel.receiverId),
  });
  logger.info(`delivered message from ${parcel.senderId} to ${parcel.receiverId} in "${parcel.receiverLanguage}"`);
};

const deliverUpdate = async (parcel) => {
  client.deliverParcel({
    ...client.getContactListParcel(),
    receiverId: parcel.senderId,
  });
  logger.info(`delivered updated list of clients to ${parcel.senderId}`);
};

const processParcel = async (parcel) => {
  logger.info(`recieved parcel of type ${parcel.type}`);
  switch (parcel.type) {
    case 'DIRECT MESSAGE':
      return await deliverTranslation(parcel);
    case 'UPDATE CONTACTS':
      return await deliverUpdate(parcel);
    case 'REPORT SUCCESS':
      logger.info(parcel.message);
      return;
    default:
      const errorMessage = `Unhandled parcel type "${parcel.type}" recieved from ${parcel.senderId}!`;
      logger.error(errorMessage)
      console.log(errorMessage);
      throw new TypeError(errorMessage);
  }
}

module.exports = {
  processParcel,
};