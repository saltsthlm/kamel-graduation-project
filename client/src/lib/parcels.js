const getNewParcel = (type, senderId, receiverId, kwargs) => {
  const parcelTemplate = {
    receiverId,
    senderId,
    timeStamp: Date.now(),
  };

  const parcel = {
    type,
    ...parcelTemplate,
    ...kwargs,
  };

  return parcel;
};

const pong = (parcel) => (
  JSON.stringify({
    type: 'RETURN PONG',
    message: 'connection still open',
    senderId: parcel.receiverId,
  })
);

const processParcel = ({ event, setContactList, setChatMessages, updateChatMessages, socket, setWebRtcSignal, setSubTitles }) => {
  const parcel = JSON.parse(event.data);
  switch (parcel.type) {
    case 'DIRECT MESSAGE':
      return setChatMessages((messages) => updateChatMessages(messages, parcel));
    case 'OFFER VIDEO':
      return setWebRtcSignal(parcel.signal);
    case 'SEND PING':
      return socket.send(pong(parcel));
    case 'TRANSLATE SUBTITLES':
      return setSubTitles(parcel.translatedMessage);
    case 'UPDATE CONTACTS':
      return setContactList(parcel.connectedClients);
    default:
      return console.log(`received parcel of unknown type "${parcel.type}"`);
  }
}

export { getNewParcel, processParcel };
