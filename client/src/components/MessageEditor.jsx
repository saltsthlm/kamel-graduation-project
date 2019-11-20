import React, { useState } from "react";

const MessageEditor = ({ sendMessage , chatPartner}) => {
    const [message, setMessage] = useState('');
    
  const inputValue = (e) => {
      console.log(e.target.value);
      setMessage(e.target.value);
  }

  const sendAndClear = () => {
      console.log(message);
      sendMessage(chatPartner, message);
      setMessage('');
  }

  return (
    <div>
     <input type='text' value={message} onChange={inputValue}></input>
     <button onClick={sendAndClear}>Send</button>
    </div>
  );
}

export default MessageEditor;
