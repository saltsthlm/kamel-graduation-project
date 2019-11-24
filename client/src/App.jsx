import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import Chat from './components/Chat/Chat';
// import Navigation from './components/Navigation/Navigation';
import Login from './components/Login';
import './scss/App.scss';

function App() {
  const [user, setUser] = useState('');
  const [socket, setSocket] = useState('');

  useEffect(() => {
    if (user.userId) {
      const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const { host } = window.location;
      const socket = new WebSocket(`${protocolPrefix}//${host}/socket/${user.userId}`);

      socket.onopen = () => {
        socket.send(JSON.stringify({
          type: 'REPORT SUCCESS',
          message: 'Initialized connection on client!',
          senderId: user.userId,
        }));
        setSocket(socket);
      };

      socket.onerror = (error) => console.log(error);
    }
  }, [user]);

  const PrivateRoute = ({ authed, ...rest }) => {
    return (
      <Route
        {...rest}
        render={() => authed
          ? <Chat user={user} socket={socket} userLanguage='en'/>
          : <Redirect to='/login' setUser={setUser} user={user} />}
      />
    )
  }

  return (
    <div className="App">
      <Router>
        <Route>
          <Switch>
            <Route path='/login'>
              <Login setUser={setUser} user={user} />
            </Route>
            <PrivateRoute path='/' exact authed={user.userId} />
          </Switch>
        </Route>
      </Router>
    </div>
  );
}

export default App;
