import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp, faVideo } from '@fortawesome/free-solid-svg-icons';

const MessageEditor = ({ sendParcel, initiateWebRtc }) => {
  const [message, setMessage] = useState('');

  const inputValue = (event) => {
    setMessage(event.target.value);
  }

  const sendDirectMessageAndClear = (event) => {
    event.preventDefault();
    sendParcel('DIRECT MESSAGE', { message });
    setMessage('');

  }


  return (
    <form className='message-editor'>
      <input type='text' value={message} onChange={inputValue}></input>
      <button className='bttn-unite bttn-xs' type="submit" onClick={sendDirectMessageAndClear}><FontAwesomeIcon icon={faArrowAltCircleUp} /></button>
      <button className='bttn-unite bttn-xs' type="button" onClick={initiateWebRtc}><FontAwesomeIcon icon={faVideo} /></button>
    </form>
  );
}

export default MessageEditor;
