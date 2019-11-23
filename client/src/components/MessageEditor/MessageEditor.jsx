import React, { useState } from "react";

const MessageEditor = ({ sendParcel, initiateWebRtc }) => {
  const [message, setMessage] = useState('');

  const inputValue = (event) => {
    setMessage(event.target.value);
  }

  const sendDirectMessageAndClear = (event) => {
    event.preventDefault();
    sendParcel('DIRECT MESSAGE', {message});
    setMessage('');
  }

  return (
    <form className='message-editor'>
      <span onClick={initiateWebRtc}>Video</span>
      <input type='text' value={message} onChange={inputValue}></input>
      <button type="submit" onClick={sendDirectMessageAndClear}>Send</button>
    </form>
  );
}

export default MessageEditor;
