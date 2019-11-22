import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import Chat from './components/Chat/Chat';
// import Navigation from './components/Navigation/Navigation';
import Login from './components/Login';
import './scss/App.scss';

function App() {
  const [userId, setUserId] = useState('');
  const [socket, setSocket] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (userId) {
      const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const { host } = window.location;
      const socket = new WebSocket(`${protocolPrefix}//${host}/socket/${userId}`);

      socket.onopen = () => {
        socket.send(JSON.stringify({ message: "Initialized connection on client!" }));
        setSocket(socket);
      };

      socket.onerror = (error) => console.log(error);
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
      <Router>
        <Route>
          <Switch>
            <Route path='/login'>
              <Login setUserId={setUserId} userId={userId} setUserName={setUserName} />
            </Route>
            <PrivateRoute path='/' exact authed={userId} />
          </Switch>
        </Route>
      </Router>
    </div>
  );
}

export default App;
