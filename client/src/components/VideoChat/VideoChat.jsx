import React, { useEffect } from "react";
import * as webRtc from '../../lib/webrtc';

const videoCss = {
  transform: 'rotateY(180deg)',
  height: '100%',
}

const VideoChat = ({ setWebRtcPeer, webRtcPeer, setWebRtcSignal, activeVideoCall }) => {

  // end current WebRTC connection
  const endWebRtc = () => {
    webRtcPeer.destroy();
    setWebRtcSignal('');
    setWebRtcPeer('');
  }

  return (
    <div style={{ display: activeVideoCall ? 'block' : 'none', height: '95%', backgroundColor: 'black' }}>
      <video id="video" style={videoCss}></video>
      <div style={{ display: 'flex' }}>
        <button onClick={endWebRtc}>Hang Up</button>
      </div>
    </div>
  );
}

export default VideoChat;
