export const updateChatMessages = (messages, parcel, senderId = parcel.senderId) => {
  const senderMessages = (messages[senderId])
    ? [...messages[senderId], parcel]
    : [parcel];

  return {
    ...messages, 
    [senderId]: senderMessages
  };
}

export const updateContactList = (userId, socket) => {
  const parcel = {
    senderId: userId,
    type: 'REQUEST CONTACT LIST UPDATE',
    timeStamp: Date.now(),
  };
  socket.send(JSON.stringify(parcel));
}
