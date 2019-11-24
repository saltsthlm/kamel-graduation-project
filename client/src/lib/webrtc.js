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
  setWebRtcPeer,
  setWebRtcSignal}) => {

  webRtcPeer.on('connect', async () => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    webRtcPeer.addStream(stream)
    continuousSpeechToSubtitle(
      language,
      (transcript) => sendParcel('TRANSLATE SUBTITLES', {message: transcript}),
      console.log,
      console.log,
      console.log
    );
  });

  webRtcPeer.on('close', () => {
    setActiveVideoCall(false);
    setWebRtcPeer(false);
    setWebRtcSignal(false);
    // stream.getTracks().forEach((track) => track.stop());
  });

  webRtcPeer.on('signal', signal => (
    sendParcel('OFFER VIDEO', {signal, receiverId: chatPartner.userId}))
  );

  webRtcPeer.on('stream', stream => {
    const video =  document.querySelector('#video');
    setActiveVideoCall(true);
    video.srcObject = stream;
    video.muted = true;
    video.play();
  })
}

export { newPeer, newInitiator, setupListeners };
