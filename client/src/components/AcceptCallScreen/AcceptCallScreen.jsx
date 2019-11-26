import React, { } from "react";

const AcceptCallScreen = ({ setAcceptCall, endWebRtc, css }) => {

  const acceptCall = () => {
    setAcceptCall(true);
  }

  return (
    <div className="incoming-call" style={css}>
      <div className="incoming-call_toolbar" id="toolbar">
        
        <button className="incoming-call_toolbar_accept" onClick={acceptCall} >Accept</button>
        <button className="incoming-call_toolbar_decline" onClick={endWebRtc} style={css}>Decline</button>
      </div>
    </div>

  );
}

export default AcceptCallScreen;
