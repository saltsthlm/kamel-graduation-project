import React, { useEffect } from "react";

const videoCss = {
  transform: 'rotateY(180deg)',
  flex: '1',
  zIndex: '0',
}

const toolbarCss = {
  display: 'flex',
  height: '40px',
  marginTop: '-40px',
  zIndex: '1',
}

const subtitlesCss = {
  color: 'white',
  flex: '1',
  textAlign: 'center',
  fontSize: '24px',
  outlineColor: 'white',
  textShadow: '0px 0px 1px black',
}

const VideoChat = ({ webRtcPeer, activeVideoCall, subTitles, setSubTitles }) => {
  
  useEffect(() => {
    setSubTitles('');
  }, [webRtcPeer, setSubTitles]);

  const endWebRtc = () => {
    webRtcPeer.destroy();
  }

  return (
    <div style={{ display: activeVideoCall ? 'flex' : 'none', flexDirection: 'column', height: '100%', backgroundColor: 'black' }}>
      <video id="video" style={videoCss}></video>
      <div style={toolbarCss}>
        <div style={subtitlesCss} className="subtitles">
          <span >{subTitles}</span>
        </div>
        <button onClick={endWebRtc}>Hang Up</button>
      </div>
    </div>
  );
}

export default VideoChat;
