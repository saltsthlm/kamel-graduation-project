import React, { useState, useEffect, useCallback } from 'react';
import ContactList from './ContactList';
import ChatBoard from './ChatBoard';
import { updateChatMessages, updateContactList } from '../lib/chat';

function Chat({ userId, socket, userName }) {
  const [contactList, setContactList] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [chatPartner, setChatPartner] = useState({});

  const socketSetupCallback = useCallback(() => (
    updateContactList(userId, socket)
  ), [userId, socket])
 
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

  const sendMessage = (message) => {
    const parcel = {
      message,
      receiverId: chatPartner.userId,
      senderId: userId,
      type: 'DIRECT MESSAGE',
      timeStamp: Date.now(),
    };
    socket.send(JSON.stringify(parcel));
  };

  const getChatMessages = () => (
    chatPartner.userId && chatMessages[chatPartner.userId]
      ? chatMessages[chatPartner.userId] 
      : []
  )

  return (
    <div className="chat">
      <h3>Welcome {userName}</h3>
      <ChatBoard chatMessages={getChatMessages()} chatPartner={chatPartner} sendMessage={sendMessage}/>
      <ContactList contactList={contactList} setChatPartner={setChatPartner} />
    </div>
  );
}

export default Chat;
