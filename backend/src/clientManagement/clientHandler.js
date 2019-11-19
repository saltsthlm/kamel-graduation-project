let connectedClients = [];

const addConnectedClient = (clientId, ws) => {
  connectedClients.push({
    clientId,
    ws,
  });
};

const removeConnectedClient = (clientId) => {
  connectedClients = connectedClients.filter((client) => client.clientId !== clientId);
};


const deliverParcel = (parcel) => {
  const { ws } = connectedClients.find((client) => client.clientId === parcel.receiverId);
  ws.send(JSON.stringify(parcel));
};

const communicateConnectedClients = () => {
  const parcel = {
    type: 'UPDATE CONTACTLIST',
    connectedClients: connectedClients.map((client) => client.clientId),
  };
  connectedClients.forEach((client) => deliverParcel({ ...parcel, receiverId: client.clientId }));
};


module.exports = {
  connectedClients,
  addConnectedClient,
  communicateConnectedClients,
  removeConnectedClient,
  deliverParcel,
};
