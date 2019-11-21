
let connectedClients = [];
const loggedInUsers = [];


const deliverParcel = (parcel) => {
  const { ws } = connectedClients.find((client) => client.clientId === parcel.receiverId);
  ws.send(JSON.stringify(parcel));
};

const getUserNameFromId = (id) => {
  const user = loggedInUsers.find((user) => user.userId === id);
  return user.userName;
}

const addConnected = (clientId, ws) => {
  connectedClients.push({
    clientId,
    clientName: getUserNameFromId(clientId),
    ws,
  });
};

const removeConnected = (clientId) => {
  connectedClients = connectedClients.filter((client) => client.clientId !== clientId);
};

const getContactListParcel = () => ({
  type: 'UPDATE CONTACTLIST',
  connectedClients: connectedClients.map((client) => ({
    clientId: client.clientId,
    clientName: client.clientName,
  })),
});

const communicateConnected = () => {
  const parcel = getContactListParcel();
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
  getContactListParcel,
  loggedInUsers,
};
