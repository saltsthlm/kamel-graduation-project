import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import ISO6391 from 'iso-639-1';

const languageList = ISO6391.getAllNames();
console.log(ISO6391.getCode('Swedish'));

// const languageToCode = ISO6391.getCode({language})
// console.log(languageToCode)

function Register({ user }) {
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

  const dropDownChange = (e) => {
    e.persist();
    const languageLong = e.target.value;
    const languageCode = ISO6391.getCode(languageLong);
    setInput((previousInput) => ({
      ...previousInput, 
      language: languageCode,
    }));
  }


  const login = async (e) => {
    e.preventDefault();
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input),
    });
    if (response.status === 200) {
      window.location.href = '/login';
    }
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
          <select onChange={dropDownChange} className='login_form_user-input_select' name='language'>
            {languageList.map(language => (
              <option key='language'>{language}</option>
            ))}
          </select>
          {/* <input type=\'text' name='language' id='language'onChange={inputChange} className='login_form_user-input_field' required/> */}
        </div>
        <div className="login_form_button">
          <button type="submit" >Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
