import React, { } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faTimes } from '@fortawesome/free-solid-svg-icons';



const AcceptCallScreen = ({ setAcceptCall, endWebRtc, css, chatPartner }) => {

  const acceptCall = () => {
    setAcceptCall(true);
  }

  return (
    <div className="incoming-call" style={css}>
      <p className="incoming-call_message">{chatPartner.userName} is calling</p>
      <div className="incoming-call_toolbar" id="toolbar">
        <FontAwesomeIcon className="incoming-call_tools" icon={faVideo} onClick={acceptCall} />
        <FontAwesomeIcon className="incoming-call_tools" icon={faTimes} onClick={endWebRtc} />
        {/* <button className="incoming-call_toolbar_decline" onClick={endWebRtc} style={css}>Decline</button> */}
      </div>
    </div>

  );
}

export default AcceptCallScreen;
