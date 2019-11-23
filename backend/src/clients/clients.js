const connectedClients = [];
const loggedInUsers = [];

const getUserById = (id) => loggedInUsers.find((user) => user.userId === id);

const getUserNameById = (id) => {
  const user = getUserById(id);
  return user.userName;
};

const getUserLanguageById = (id) => {
  const user = getUserById(id);
  return user.language;
};

const addConnected = (clientId, ws) => {
  connectedClients.push({
    clientId,
    language: getUserLanguageById(clientId),
    clientName: getUserNameById(clientId),
    ws,
  });
};

const removeConnectionById = (clientId) => {
  const clientIndex = connectedClients.findIndex((client) => (
    client.clientId === clientId
  ));
  connectedClients.splice(clientIndex, 1);
};

module.exports = {
  connectedClients,
  addConnected,
  removeConnectionById,
  loggedInUsers,
  getUserLanguageById,
};
