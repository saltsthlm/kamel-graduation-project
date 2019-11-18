import SimplePeer from 'simple-peer';


const peer = new SimplePeer({
  initiator: isInitiator,
  trickle: false,
});

peer.on('signal', (signalId) => {

})

// when message from peer is reveived, print it to the page
peer.on('data', (message) => {
  const decoded = new TextDecoder("utf-8").decode(message)
  console.log('received data: ', decoded);
})

