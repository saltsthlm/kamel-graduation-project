import React, { useState, useEffect } from 'react';
import './App.css';
import ContactList from './components/ContactList';
import uuid from 'uuid/v4';
import Chat from './components/Chat';

const updateChatMessages = (messages, parcel) => {
  const messagesToReturn = {...messages};

  const allMessages = (messages[parcel.senderId])
    ? [...messagesToReturn[parcel.senderId], parcel]
    : [parcel];

  messagesToReturn[parcel.senderId] = allMessages;
  return messagesToReturn;
}

function App() {
  const [userId] = useState(uuid());
  const [contactList, setContactList] = useState([]);
  const [socket, setSocket] = useState('');
  const [chatMessages, setChatMessages] = useState({});
  const [chatPartner, setChatPartner] = useState('');

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/socket/${userId}`);
    setSocket(socket);
    socket.onopen = () => {
      socket.send(JSON.stringify({ message: "Initialized connection on client!" }));
    };

    socket.onmessage = (event) => {
      const parcel = JSON.parse(event.data);
      if (parcel.type === 'UPDATE CONTACTLIST') {
        setContactList(parcel.connectedClients);
      }
      if (parcel.type === 'DIRECT MESSAGE') {
        setChatMessages((messages) => updateChatMessages(messages, parcel));
      }
    }
  }, [userId])

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
    <div className="App">
      <h3>Me</h3>
      <p>{userId}</p>
      <ContactList contactList={contactList} sendMessage={sendMessage} setChatPartner={setChatPartner} />
      <Chat chatMessages={chatMessages} chatPartner={chatPartner}  />
    </div>
  );
}

export default App;
