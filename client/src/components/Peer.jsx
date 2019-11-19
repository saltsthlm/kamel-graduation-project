import React, { useState } from 'react';
import SimplePeer from 'simple-peer';

const Peer = ({ userId }) => {
  const [signalId, setSignalId] = useState('');
  const [isInitiator, setIsInitiator] = useState(false);

  const [otherId, setOtherId] = useState('');
  const [peer, setPeer] = useState('');
  const [inbox, setInbox] = useState([]);
  const [outMessage, setOutMessage] = useState('');

  const getSignalId = () => {
    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
    });
    peer.on('signal', (signalId) => {
      setSignalId(signalId);
      // socket.send(JSON.stringify({clientId, signalId})); 
    })
    // when message from peer is reveived, print it to the page
    peer.on('data', (message) => {
      const decoded = new TextDecoder("utf-8").decode(message)
      console.log('received data: ', decoded);
      setInbox([...inbox, decoded]);
    })
    setPeer(peer);
  }

  const updateOtherId = (event) => {
    setOtherId(event.target.value);
  }

  const updateOutgoingMessage = (event) => {
    setOutMessage(event.target.value);
  }

  const connectToPeer = () => {
    console.log(isInitiator);
    peer.signal(JSON.parse(otherId));
  };

  const sendToPeer = () => {
    console.log('I will send this now:', outMessage);
    peer.send(JSON.stringify({message: outMessage}));
  };

  const setInitiator = () => {
    setIsInitiator(!isInitiator);
  }

  return (
    <div>
      <button onClick={getSignalId}>Get Id</button>
      <input type="checkbox" value={isInitiator} onChange={setInitiator}></input>
      <h1>WebRTC ID</h1>
      <p>{JSON.stringify(signalId)}</p>

      <h1>Other ID</h1>
      <input type="text" value={otherId} onChange={updateOtherId}></input>
      <button onClick={connectToPeer}>Connect</button>

      <h1>Inbox</h1>
      {inbox.map((msg, i) => <p key={i}>{msg}</p>)}

      <h1>Send Message</h1>
      <input type="text" value={outMessage} onChange={updateOutgoingMessage}></input>
      <button onClick={sendToPeer}>Send Message</button>
    </div>
  );
}
 
export default Peer;
