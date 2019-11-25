import React, { useState } from "react";
import { Redirect } from "react-router-dom";

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
    const credentials = await response.json();
    setUser(credentials);
  };

  if (user.userId) {
    return <Redirect to='/'/>
  }

  return (
    <div className="login">
      <form onSubmit={login} className="login_form">
        <h1 className="login_form_header">Sign Up</h1>
        <div className='login_form_user-input'>
          <label htmlFor='userName' className='login_form_user-input_label'> Name: </label>
          <input type='text' name='userName' id='userName' onChange={inputChange} className='login_form_user-input_field' required/>
        </div>
        <div className='login_form_user-input'>
          <label htmlFor='email' className='login_form_user-input_label'> Email: </label>
          <input type='email' name='email' id='email' onChange={inputChange} className='login_form_user-input_field' required/>
        </div>
        <div className='login_form_user-input'>
          <label htmlFor='password' className='login_form_user-input_label'> Password: </label>
          <input type='password' name='password' id='password' onChange={inputChange} className='login_form_user-input_field' required/>
        </div>
        <div className='login_form_user-input'>
          <label htmlFor='language' className='login_form_user-input_label'> Language: </label>
          <input type='text' name='language' id='language'onChange={inputChange} className='login_form_user-input_field' required/>
        </div>
        <div className="login_form_button">
          <button type="submit" >Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
