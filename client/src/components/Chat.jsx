import React, { useState, useEffect, useCallback } from 'react';
import ContactList from './ContactList';
import ChatBoard from './ChatBoard';

const updateChatMessages = (messages, parcel) => {
  const messagesToReturn = {...messages};

  const allMessages = (messages[parcel.senderId])
    ? [...messagesToReturn[parcel.senderId], parcel]
    : [parcel];

  messagesToReturn[parcel.senderId] = allMessages;
  return messagesToReturn;
}

const updateContactList = (userId, socket) => {
  const parcel = {
    senderId: userId,
    type: 'REQUEST CONTACT LIST UPDATE',
    timeStamp: Date.now(),
  };
  socket.send(JSON.stringify(parcel));
}

function Chat({ userId, socket }) {
  const [contactList, setContactList] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [chatPartner, setChatPartner] = useState('');

  const socketSetupCallback = useCallback(() => updateContactList(userId, socket), [userId, socket])
 
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const parcel = JSON.parse(event.data);
        if (parcel.type === 'UPDATE CONTACTLIST') {
          setContactList(parcel.connectedClients);
        }
        if (parcel.type === 'DIRECT MESSAGE') {
          setChatMessages((messages) => updateChatMessages(messages, parcel));
        }
      }
      socketSetupCallback();
    }
  }, [socket, socketSetupCallback])

  return (
    <div className="chat">
      <ChatBoard chatMessages={chatMessages} chatPartner={chatPartner}  />
      <ContactList contactList={contactList} setChatPartner={setChatPartner} socket={socket} userId={userId}/>
    </div>
  );
}

export default Chat;
