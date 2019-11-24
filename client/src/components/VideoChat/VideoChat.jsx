import React, { useEffect } from "react";
import * as webRtc from '../../lib/webrtc';

const videoCss = {
  transform: 'rotateY(180deg)',
  height: '100%',
}

const videoConfig = {
  video: {
    width: 1280,
    height: 720,
  },
  audio: true,
}

const VideoChat = ({ chatPartner, setActiveVideoCall, setWebRtcPeer, webRtcPeer, sendParcel, webRtcSignal, setWebRtcSignal, activeVideoCall }) => {

  // when WebRTC signaling data is received
  useEffect(() => {
    // if the user is joining a call
    if (webRtcSignal && !webRtcPeer) {
      const peer = webRtc.newPeer();
      peer.signal(webRtcSignal);
      setWebRtcPeer(peer);
      // if the user is initiating a call
    } else if (webRtcSignal && webRtcPeer) {
      webRtcPeer.signal(webRtcSignal);
    }
  }, [webRtcSignal, webRtcPeer, setWebRtcPeer])

  // set-up WebRTC listeners once WebRTC client is initiated
  useEffect(() => {
    if (webRtcPeer) {
      webRtcPeer.on('connect', () => webRtcPeer.send('ready when you are :)'));
      webRtcPeer.on('close', () => setActiveVideoCall(false));
      webRtcPeer.on('signal', signal => (
        sendParcel('OFFER VIDEO', { signal, receiverId: chatPartner.userId }))
      );
      webRtcPeer.on('stream', stream => {
        const video = document.querySelector('#video');
        setActiveVideoCall(true);
        video.srcObject = stream;
        video.muted = true;
        video.play();
      })
      navigator.mediaDevices.getUserMedia(videoConfig)
        .then((stream) => webRtcPeer.addStream(stream));
    }
    // eslint-disable-next-line 
  }, [webRtcPeer, activeVideoCall, chatPartner]);

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
