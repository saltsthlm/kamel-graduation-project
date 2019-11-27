// TODO: change senderId to parcel.userName
export const updateChatMessages = (messages, parcel, senderName = parcel.userName) => {
  const senderMessages = (messages[senderName])
    ? [...messages[senderName], parcel]
    : [parcel];

  return {
    ...messages, 
    [senderName]: senderMessages
  };
}

export const updateContactList = (userId, socket) => {
  const parcel = {
    senderId: userId,
    type: 'UPDATE CONTACTS',
    timeStamp: Date.now(),
  };
  socket.send(JSON.stringify(parcel));
}
