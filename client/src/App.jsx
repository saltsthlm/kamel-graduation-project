import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import Chat from './components/Chat';
import Navigation from './components/Navigation';
import Login from './components/Login';

import './App.scss';

function App() {
  const [userId, setUserId] = useState('');
  const [socket, setSocket] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (userId) {
      const socket = new WebSocket(`ws://localhost:8080/socket/${userId}`);
      socket.onopen = () => {
        socket.send(JSON.stringify({ message: "Initialized connection on client!" }));
        setSocket(socket);
      };
    }
  }, [userId]);

  const PrivateRoute =({ authed, ...rest }) => {
    return (
      <Route
        {...rest}
        render={() => authed
          ? <Chat userId={userId} userName={userName} socket={socket} />
          : <Redirect to='/login' setUserId={setUserId} userId={userId} />}
      />
    )
  }

  return (
    <div className="App">
      <Route>
        <Navigation />
        <Switch>
          <Route path='/login'>
            <Login setUserId={setUserId} userId={userId} setUserName={setUserName} />
          </Route>
          <PrivateRoute path='/' exact authed={userId} />
        </Switch>
      </Route>
    </div>
  );
}

export default App;
