let connectedClients = [];

const deliverParcel = (parcel) => {
  const { ws } = connectedClients.find((client) => client.clientId === parcel.receiverId);
  ws.send(JSON.stringify(parcel));
};

const addConnected = (clientId, ws) => {
  connectedClients.push({
    clientId,
    ws,
  });
};

const removeConnected = (clientId) => {
  connectedClients = connectedClients.filter((client) => client.clientId !== clientId);
};

const communicateConnected = () => {
  const parcel = {
    type: 'UPDATE CONTACTLIST',
    connectedClients: connectedClients.map((client) => client.clientId),
  };
  connectedClients.forEach((client) => deliverParcel({
    ...parcel,
    receiverId: client.clientId,
  }));
};

module.exports = {
  connectedClients,
  addConnected,
  communicateConnected,
  removeConnected,
  deliverParcel,
};
