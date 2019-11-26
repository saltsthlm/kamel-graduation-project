import React, { useEffect } from "react";

const VideoChat = ({ webRtcPeer, activeVideoCall, subTitles, setSubTitles, endWebRtc }) => {
  
  useEffect(() => {
    setSubTitles('');
  }, [webRtcPeer, setSubTitles]);

  const toggleMute = () => {
    const video =  document.querySelector('#video');
    video.muted = !video.muted;
  }

  return (
    <div className="video-chat" style={{ display: activeVideoCall ? 'flex' : 'none' }} >
      <video id="video-secondary" className="video-chat_video_secondary"></video>
      <video id="video" className="video-chat_video"></video>
      <div className="video-chat_toolbar">
        <div className="video-chat_toolbar_subtitles">
          <span >{subTitles}</span>
        </div>
        <button onClick={endWebRtc}>Hang Up</button>
        <button onClick={toggleMute}>Toggle Sound</button>
      </div>
    </div>
  );
}

export default VideoChat;
