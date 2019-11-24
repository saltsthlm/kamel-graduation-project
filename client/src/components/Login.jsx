import React from "react";
import { Redirect } from "react-router-dom";

function Login({ setUser, user }) {
  const login = async () => {
    const response = await fetch('/login', {
      method: 'POST',
    });
    const credentials = await response.json();
    setUser(credentials);
  };

  if (user.userId) {
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
