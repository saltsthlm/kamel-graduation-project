export const updateChatMessages = (messages, parcel) => {
    const messagesToReturn = {...messages};
  
    const allMessages = (messages[parcel.senderId])
      ? [...messagesToReturn[parcel.senderId], parcel]
      : [parcel];
  
    messagesToReturn[parcel.senderId] = allMessages;
    return messagesToReturn;
  }

export  const updateContactList = (userId, socket) => {
    const parcel = {
      senderId: userId,
      type: 'REQUEST CONTACT LIST UPDATE',
      timeStamp: Date.now(),
    };
    socket.send(JSON.stringify(parcel));
  }