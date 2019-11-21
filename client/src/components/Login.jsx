import React from "react";
import { Redirect } from "react-router-dom";

function Login({ setUserId, userId, setUserName }) {
  const login = async () => {
    const response = await fetch('/login', {
      method: 'POST',
    });
    const credentials = await response.json();
    setUserId(credentials.userId);
    setUserName(credentials.userName);
  };

  if (userId) {
    return <Redirect to='/'/>
  }

  return (
    <div className="login">
      <h3>Login</h3>
      <button type="button" onClick={login}>Login</button>
    </div>
  );
}

export default Login;
