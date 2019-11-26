import React, { useState,  } from "react";
import { Redirect, Link } from "react-router-dom";

function Login({ setUser, user }) {
  const [ input, setInput ] = useState({ 
    userName: '',
    email: '',
    password: '',
    language:'',
  });

  const inputChange = (e) => {
    e.persist();
    setInput((previousInput) => ({
      ...previousInput, 
      [e.target.id]: e.target.value,
    }));
  }

  const login = async (e) => {
    e.preventDefault();
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input),
    });
    if (response.status === 200) {
      const credentials = await response.json();
      setUser(credentials);
    }
  };

  if (user.userId) {
    return <Redirect to='/'/>
  }

  return (
    <div className="login">
      <form onSubmit={login} className="login_form">
        <h1 className="login_form_header">Sign In</h1>
        <div className='login_form_user-input'>
          <label htmlFor='email' className='login_form_user-input_label'> Email: </label>
          <input type='email' name='email' id='email' onChange={inputChange} className='login_form_user-input_field' required/>
        </div>
        <div className='login_form_user-input'>
          <label htmlFor='password' className='login_form_user-input_label'> Password: </label>
          <input type='password' name='password' id='password' onChange={inputChange} className='login_form_user-input_field' required/>
        </div>
        <div className="login_form_button">
          <button type="submit" >Sign In</button>
        </div>
      </form>
      <Link to="/register">Register</Link>
    </div>
  );
}

export default Login;
