import React, { useEffect } from "react";

const VideoChat = ({ webRtcPeer, activeVideoCall, subTitles, setSubTitles }) => {
  
  useEffect(() => {
    setSubTitles('');
  }, [webRtcPeer, setSubTitles]);

  const endWebRtc = () => {
    webRtcPeer.destroy();
  }

  return (
    <div className="video-chat" style={{ display: activeVideoCall ? 'flex' : 'none' }} >
      <video id="video" className="video-chat_video"></video>
      <div className="video-chat_toolbar">
        <div className="video-chat_toolbar_subtitles">
          <span >{subTitles}</span>
        </div>
        <button onClick={endWebRtc}>Hang Up</button>
      </div>
    </div>
  );
}

export default VideoChat;
