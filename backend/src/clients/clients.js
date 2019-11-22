
let connectedClients = [];
const loggedInUsers = [];


const deliverParcel = (parcel) => {
  const { ws } = connectedClients.find((client) => client.clientId === parcel.receiverId);
  ws.send(JSON.stringify(parcel));
};

const getUserById = (id) => loggedInUsers.find((user) => user.userId === id);

const getUserNameFromId = (id) => {
  const user = getUserById(id);
  return user.userName;
};

const getUserLanguage = (id) => {
  const user = getUserById(id);
  return user.language;
};

const addConnected = (clientId, ws) => {
  connectedClients.push({
    clientId,
    language: getUserLanguage(clientId),
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
    userId: client.clientId,
    userName: client.clientName,
    language: client.language,
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
  getUserLanguage,
};
