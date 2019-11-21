import React, { useState } from "react";

const MessageEditor = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const inputValue = (event) => {
    setMessage(event.target.value);
  }

  const sendAndClear = (event) => {
    event.preventDefault();
    sendMessage(message);
    setMessage('');
  }

  return (
    <form className='message-editor'>
      <input type='text' value={message} onChange={inputValue}></input>
      <button type="submit" onClick={sendAndClear}>Send</button>
    </form>
  );
}

export default MessageEditor;
