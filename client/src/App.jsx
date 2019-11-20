import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route } from "react-router-dom";
import './App.css';
import uuid from 'uuid/v4';
import Chat from './components/Chat';
import Navigation from './components/Navigation';

function App() {
  const [userId] = useState(uuid());
  const [socket, setSocket] = useState('');

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/socket/${userId}`);
    socket.onopen = () => {
      socket.send(JSON.stringify({ message: "Initialized connection on client!" }));
    };
    setSocket(socket);
  }, [userId])

  return (
    <Router>
      <div className="App">
        <h3>You are:{userId}</h3>
        <Route>
          <Navigation />
          <Switch>
            <Route path="/chat">
              <Chat userId={userId} socket={socket} />
            </Route>
          </Switch>
        </Route>
      </div>
    </Router>
  );
}

export default App;
