const getNewParcel = (type, senderId, receiverId, kwargs) => {
  const parcelTemplate = {
    receiverId,
    senderId,
    timeStamp: Date.now()
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
    senderId: parcel.receiverId
  })
);

const processParcel = ({event, setContactList, setChatMessages, updateChatMessages, socket, setWebRtcSignal, setSubTitles}) => {
  const parcel = JSON.parse(event.data);
  if (parcel.type === 'UPDATE CONTACTLIST') {          
    setContactList(parcel.connectedClients);
  }
  if (parcel.type === 'DIRECT MESSAGE') {
    setChatMessages((messages) => updateChatMessages(messages, parcel));
  }
  if (parcel.type === 'SEND PING') {
    socket.send(pong(parcel));
  }
  if (parcel.type === 'OFFER VIDEO') {
    setWebRtcSignal(parcel.signal);
  }
  if (parcel.type === 'TRANSLATE SUBTITLES') {
    setSubTitles(parcel.translatedMessage);
  }
}

export { getNewParcel, processParcel };
