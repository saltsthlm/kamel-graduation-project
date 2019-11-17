// Set-up a peer-to-peer connection using WebRTC.
// This will be used to exchange chat messages

const Peer = require('simple-peer');

// create a new Peer
const peer = new Peer({
  initiator: location.hash === '#1',
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


// Set-up a websocket connection.
// This wil be used to initialize the WebRTC connection (see above)

// Set-up a websocket connection to our backend
const socket = new WebSocket('ws://localhost:8080/socket/123');

// when the socket connection opens, send a message to the server
socket.onopen = () => {
  socket.send("Initialized connection on client!"); 
};

// when we receive a message from the server, print it to the console
socket.onmessage = (event) => console.log(event.data);