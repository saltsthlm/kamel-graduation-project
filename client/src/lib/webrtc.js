import { continuousSpeechToSubtitle } from './speechToText';

const Peer = require('simple-peer');

const newPeer = () => (
  new Peer({
    initiator: false,
    trickle: false,
  })
);

const newInitiator = () => (
  new Peer({
    initiator: true,
    trickle: false,
  })
)

var constraints = { 
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 } 
  },
  audio: true,
};

const setupListeners = ({
  webRtcPeer,
  language,
  chatPartner,
  sendParcel,
  setActiveVideoCall,
  endWebRtc,
  userId}) => {
  
  console.log('setting up webrtc listeners')

  webRtcPeer.on('connect', async () => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const videoSecondary =  document.querySelector('#video-secondary');
    videoSecondary.srcObject = stream;
    videoSecondary.muted = true;
    videoSecondary.play();
    webRtcPeer.addStream(stream)
  
    try {
      continuousSpeechToSubtitle(
        language,
        (transcript) => sendParcel('TRANSLATE SUBTITLES', {message: transcript}),
        console.log,
        console.log,
        console.log
      );
    } catch (e) {
      console.log(e);
    }
  });

  webRtcPeer.on('close', () => {
    endWebRtc()
    // stream.getTracks().forEach((track) => track.stop());
  });

  webRtcPeer.on('signal', signal => {
    console.log('sending webrtc offer (on signal)');
    console.log(userId)
    sendParcel('OFFER VIDEO', {signal, senderId: userId, receiverId: chatPartner.userId});
  });

  webRtcPeer.on('stream', stream => {
    console.log('webrtc on stream')

    const video =  document.querySelector('#video');
    setActiveVideoCall(true);
    video.srcObject = stream;
    video.muted = true;
    video.play();
  })
}

export { newPeer, newInitiator, setupListeners };
