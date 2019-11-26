import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSync, faVolumeMute, faVolumeUp, faPhoneSlash } from '@fortawesome/free-solid-svg-icons';

const VideoChat = ({ webRtcPeer, activeVideoCall, subTitles, setSubTitles, endWebRtc, acceptCall }) => {
  
  const [mute, setMute] = useState(true);
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    setSubTitles('');
  }, [webRtcPeer, setSubTitles]);

  useEffect(() => {
    const removeBubble = () => {
      setBubbles((bubbles) => bubbles.slice(1));
    }
  
    setBubbles((bubbles) => [...bubbles, subTitles]);
    setTimeout(removeBubble, 5000);
  }, [subTitles]);

  const toggleMute = () => {
    const video =  document.querySelector('#video');
    video.muted = !video.muted;
    setMute(video.muted);
  }

  return (
    <>
      <div className='video-spinner' style={{ display: (!activeVideoCall && acceptCall) ? 'flex' : 'none' }}>
        <div className='video-spinner_wrapper'>
          <p className="video-spinner_wrapper_message">connecting</p>
          <FontAwesomeIcon className="video-spinner_wrapper_tools" icon={faSync}/>
        </div>
      </div>
      <div className="video-chat" style={{ display: activeVideoCall ? 'flex' : 'none' }} >
        <video id="video" className="video-chat_video"></video>
        <div className="video-chat_toolbar">
          <video id="video-secondary" className="video-chat_video_secondary"></video>
          <FontAwesomeIcon className="video-chat_toolbar_tools" icon={faTimes} onClick={endWebRtc} />
          <FontAwesomeIcon className="video-chat_toolbar_tools" icon={mute ? faVolumeMute : faVolumeUp} onClick={toggleMute} />
        </div>
        <div className="video-chat_subtitles">
          {bubbles.map((subtitle, i) => (
            <div key={i} className="video-chat_subtitles_block">
              <span >{subtitle}</span>
            </div>
          )
          )}
        </div>
      </div>
    </>
  );
}

export default VideoChat;
