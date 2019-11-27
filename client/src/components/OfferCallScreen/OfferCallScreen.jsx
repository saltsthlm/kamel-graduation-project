import React, { } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';



const OfferCallScreen = ({ endWebRtc, css, chatPartner }) => {

  return (
    <div className="outgoing-call" style={css}>
      <p className="outgoing-call_message">Calling {chatPartner.userName}. Please wait.</p>
      <div className="outgoing-call_toolbar" id="toolbar">
        <FontAwesomeIcon className="outgoing-call_tools" icon={faTimes} onClick={endWebRtc} />
        {/* <button className="incoming-call_toolbar_decline" onClick={endWebRtc} style={css}>Decline</button> */}
      </div>
    </div>

  );
}

export default OfferCallScreen;
