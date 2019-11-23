var Peer = require('simple-peer') // create peer without waiting for media
 
var peer1 = new Peer({ initiator: true }) // you don't need streams here
var peer2 = new Peer()
 
peer1.on('signal', data => {
  peer2.signal(data)
})
 
peer2.on('signal', data => {
  peer1.signal(data)
})
 
peer2.on('stream', stream => {
  // got remote video stream, now let's show it in a video tag
  var video = document.querySelector('video')
 
  if ('srcObject' in video) {
    video.srcObject = stream
  } else {
    video.src = window.URL.createObjectURL(stream) // for older browsers
  }
 
  video.play()
})
 
function addMedia (stream) {
  peer1.addStream(stream) // <- add streams to peer dynamically
}
 
// then, anytime later...
navigator.getUserMedia({ video: true, audio: true }, addMedia, () => {})


const Peer = require('simple-peer');

// create a new Peer
const peer = new Peer({
  initiator: location.hash === '#init',
  trickle: false,
})

// after signaling has succeeeded, print signaling meta data to page
peer.on('signal', (data) => {
  document.getElementById('yourId').innerText = JSON.stringify(data);
})

// establish connection to other peer
document.getElementById('connect').addEventListener('click', () => {
  const otherId = JSON.parse(document.getElementById('otherId').value);
  peer.signal(otherId);
})

// send message to peer
document.getElementById('send').addEventListener('click', () => {
  const yourMessage = document.getElementById('yourMessage').value;
  peer.send(yourMessage);
})

// when message from peer is reveived, print it to the page
peer.on('data', (data) => {
  document.getElementById('messages').textContent += `${data}\n`;
})