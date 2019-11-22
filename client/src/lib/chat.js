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
  console.log('setup callback: ', socket);
  socket.send(JSON.stringify(parcel));
  console.log('setup callback done: ', socket);

}
