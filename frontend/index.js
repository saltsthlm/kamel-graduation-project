// set-up a websocket connection to our backend. this will be used to initialize 
// the WebRTC connection (see below) later on

// set-up a websocket connection to a random socket endpoint on our backend
const clientId = Math.round(Math.random() * 2 ** 52);
const socket = new WebSocket(`ws://localhost:8080/socket/${clientId}`);

// when the socket connection opens, send a message to the server
socket.onopen = () => {
  socket.send(JSON.stringify({message: "Initialized connection on client!"})); 
};

// when we receive a message from the server, print it to the console
socket.onmessage = (event) => console.log(event.data);





// set-up a peer-to-peer connection using WebRTC.
// this will be used to exchange chat messages

const Peer = require('simple-peer');

// create a new Peer
const peer = new Peer({
  initiator: location.hash === '#init',
  trickle: false,
})

// after signaling has succeeeded, print signaling meta data to page
peer.on('signal', (data) => {
  document.getElementById('yourId').innerText = JSON.stringify(data);
  socket.send(JSON.stringify({clientId, data})); 
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
