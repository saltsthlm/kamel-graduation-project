import React, { useState, useEffect } from 'react';
import './App.css';
import ContactList from './components/ContactList';
import uuid from 'uuid/v4';


function App() {
  const [userId, setUserId] = useState(uuid());
  const [contactList, setContactList] = useState([]);
  const [socket, setSocket] = useState('');

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
        console.log(parcel);
      }
    }
  }, [])

  const sendMessage = (receiverId, message) => {
    const parcel = {
      message,
      receiverId,
      senderId: userId,
      type: 'DIRECT MESSAGE',
    };
    socket.send(JSON.stringify(parcel));
  };

  return (
    <div className="App">
      <h3>Me</h3>
      <p>{userId}</p>
      <ContactList contactList={contactList} sendMessage={sendMessage} />
    </div>
  );
}

export default App;
