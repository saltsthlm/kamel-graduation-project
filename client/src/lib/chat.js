export const updateChatMessages = (messages, parcel) => {
  const senderMessages = (messages[parcel.senderId])
    ? [...messages[parcel.senderId], parcel]
    : [parcel];

  return {
    ...messages, 
    [parcel.senderId]: senderMessages
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
