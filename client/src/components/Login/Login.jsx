import React, { useState,  } from "react";
import { Redirect, Link } from "react-router-dom";

function Login({ setUser, user }) {
  const [ input, setInput ] = useState({ 
    userName: '',
    email: '',
    password: '',
    language:'',
  });

  const [errorMessage, setErrorMessage] = useState('');

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
    } else {
      const { error } = await response.json();
      setErrorMessage(error);
    }
  };

  if (user.userId) {
    return <Redirect to='/'/>
  }

  return (
    <div className="login">
      <img alt='polychat logo' className='login_logo' src='./polychat.png' />
      <form onSubmit={login} className="login_form">
        <h1 className="login_form_header">Sign In</h1>
        <div className='login_form_user-input'>
          <label htmlFor='email' className='login_form_user-input_label'> Email: </label>
          <input type='email' onClick={() => setErrorMessage('')} name='email' id='email' onChange={inputChange} className='login_form_user-input_field' required/>
        </div>
        <div className='login_form_user-input'>
          <label htmlFor='password' className='login_form_user-input_label'> Password: </label>
          <input type='password' onClick={() => setErrorMessage('')} name='password' id='password' onChange={inputChange} className='login_form_user-input_field' required/>
        </div>
        {errorMessage ? <span className='error-message'>{errorMessage}</span> : ''}
        <div className="login_form_button">
          <button type="submit" >Sign In</button>
        </div>
      </form>
      <Link to="/register" className='link'>Register</Link>
    </div>
  );
}

export default Login;
