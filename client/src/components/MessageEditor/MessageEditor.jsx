import React, { useState } from "react";

const MessageEditor = ({ sendParcel }) => {
  const [message, setMessage] = useState('');

  const inputValue = (event) => {
    setMessage(event.target.value);
  }

  const sendDirectMessageAndClear = (event) => {
    event.preventDefault();
    sendParcel('DIRECT MESSAGE', {message});
    setMessage('');
  }

  const offerVideoCall = (event) => {
    event.preventDefault();
    sendParcel('DIRECT MESSAGE', {message});
    setMessage('');
  }

  return (
    <div className='message-editor'>
      <button onClick={offerVideoCall}>Video</button>
      <form className='message-editor'>
        <input type='text' value={message} onChange={inputValue}></input>
        <button type="submit" onClick={sendDirectMessageAndClear}>Send</button>
      </form>
    </div>
  );
}

export default MessageEditor;
