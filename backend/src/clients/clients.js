let connectedClients = [];
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
  connectedClients = connectedClients.filter((client) => (
    client.clientId !== clientId
  ));
};

module.exports = {
  connectedClients,
  addConnected,
  removeConnectionById,
  loggedInUsers,
  getUserLanguageById,
};
