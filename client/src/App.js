import React, {useState, useEffect} from 'react';
import './App.css';
import Peer from './components/Peer.jsx';
import ContactList from './components/ContactList.jsx';
import uuid from 'uuid/v4';


function App() {
  const [userId, setUserId] = useState(uuid());
  const [contactList, setContactList] = useState([]);
  
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/socket/${userId}`);
    socket.onopen = () => {
      socket.send(JSON.stringify({message: "Initialized connection on client!"})); 
    };

    socket.onmessage = (event) => {
      const contactList = JSON.parse(event.data);
      setContactList(contactList.connectedClients);
    }
  }, [])

  return (
    <div className="App">
      <h3>Me</h3>
      <p>{userId}</p>
      <ContactList contactList={contactList}/>
      <Peer userId={userId}/>
    </div>
  );
}

export default App;
