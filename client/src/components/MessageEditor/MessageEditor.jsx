import React, { useState } from "react";

const MessageEditor = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const inputValue = (e) => {
    setMessage(e.target.value);
  }

  const sendAndClear = () => {
    sendMessage(message);
    setMessage('');
  }

  return (
    <div className='message-editor'>
      <input type='text' value={message} onChange={inputValue}></input>
      <button onClick={sendAndClear}>Send</button>
    </div>
  );
}

export default MessageEditor;
