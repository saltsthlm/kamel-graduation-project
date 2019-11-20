import React, { useState, useEffect, useCallback } from 'react';
import ContactList from './ContactList';
import ChatBoard from './ChatBoard';
import { updateChatMessages, updateContactList } from '../lib/chat';

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

  const sendMessage = (receiverId, message) => {
    const parcel = {
      message,
      receiverId,
      senderId: userId,
      type: 'DIRECT MESSAGE',
      timeStamp: Date.now(),
    };
    socket.send(JSON.stringify(parcel));
  };

  return (
    <div className="chat">
      <ChatBoard chatMessages={chatMessages} chatPartner={chatPartner}  sendMessage={sendMessage}/>
      <ContactList contactList={contactList} setChatPartner={setChatPartner} sendMessage={sendMessage}/>
    </div>
  );
}

export default Chat;
