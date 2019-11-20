const client = require('../clients/clients');
const { translate } = require('../translate/translation');

const onConnect = (ws, req) => {
  req.id = req.params.id;
  client.addConnected(req.params.id, ws);
  client.communicateConnected();
};

const onClose = (req) => {
  client.removeConnected(req.id);
  client.communicateConnected();
};

const onMessage = async (data) => {
  const parcel = JSON.parse(data);

  if (parcel.type === 'DIRECT MESSAGE') {
    const translatedMessage = await translate(parcel.message, 'sv');
    client.deliverParcel({ ...parcel, translatedMessage });
  }

  if (parcel.type === 'REQUEST CONTACT LIST UPDATE') {
    client.deliverParcel({
      ...client.getContactListParcel(),
      receiverId: parcel.senderId,
    });
  }

  console.log(JSON.parse(data));
};

module.exports = {
  onClose,
  onMessage,
  onConnect,
};
