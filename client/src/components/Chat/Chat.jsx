import React, { useState, useEffect, useCallback } from 'react';
import ContactList from '../ContactList/ContactList';
import ChatBoard from '../ChatBoard/ChatBoard';
import { updateChatMessages, updateContactList } from '../../lib/chat';
import useWindowDimensions from '../../lib/window';
import * as webRtc from '../../lib/webrtc';

const pong = (parcel) => (
  JSON.stringify({
    type: 'RETURN PONG',
    message: 'connection still open',
    senderId: parcel.receiverId
  })
);

function Chat({ userId, socket }) {
  const { width } = useWindowDimensions();
  const [contactList, setContactList] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [chatPartner, setChatPartner] = useState({});
  const [webRtcPeer, setWebRtcPeer] = useState(false);
  const [webRtcSignal, setWebRtcSignal] = useState(false);

  const socketSetupCallback = useCallback(() => (
    updateContactList(userId, socket)
  ), [userId, socket])

  const sendParcel = (type, kwargs) => {
    const parcel = {
      ...{
        type,
        receiverId: chatPartner.userId,
        senderId: userId,
        timeStamp: Date.now()
      },
      ...kwargs,
    };
    if (parcel.type === 'DIRECT MESSAGE') {
      setChatMessages((messages) => updateChatMessages(messages, parcel, parcel.receiverId));
    }
    socket.send(JSON.stringify(parcel));
  };

  useEffect(() => {
    if (webRtcSignal && !webRtcPeer) {
      const peer = webRtc.newPeer();
      peer.signal(webRtcSignal);
      setWebRtcPeer(peer);
    } else if (webRtcSignal && webRtcPeer) {
      webRtcPeer.signal(webRtcSignal);
    }
  }, [webRtcSignal])

  useEffect(() => {    
    if (webRtcPeer) {
      webRtcPeer.on('data', (data) => console.log(new TextDecoder("utf-8").decode(data)));
      webRtcPeer.on('signal', signal => sendParcel('OFFER VIDEO', {signal, receiverId: chatPartner.userId}));
    }
  }, [webRtcPeer]);

  const initiateWebRtc = (event) => {
    event.preventDefault();
    setWebRtcPeer(webRtc.newInitiator());
  }
 
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const parcel = JSON.parse(event.data);
        if (parcel.type === 'UPDATE CONTACTLIST') {          
          setContactList(parcel.connectedClients);
        }
        if (parcel.type === 'DIRECT MESSAGE') {
          setChatMessages((messages) => updateChatMessages(messages, parcel));
        }
        if (parcel.type === 'SEND PING') {
          socket.send(pong(parcel));
        }
        if (parcel.type === 'OFFER VIDEO') {
          setWebRtcSignal(parcel.signal);
        }
      }
      socketSetupCallback();
    }
  }, [socket, socketSetupCallback])

  const getChatMessages = () => (
    chatPartner.userId && chatMessages[chatPartner.userId]
      ? chatMessages[chatPartner.userId] 
      : []
  )

  const getContactList = () => contactList.filter((contact) => contact.userId !== userId);

  const sendSomething = () => {
    console.log(webRtcPeer);
    webRtcPeer.send('hello')
  }

  return (
    <>
      <button onClick={sendSomething}>send something</button>
      <div className="chat">
        { (width < 700 )
          ? (chatPartner.userName 
            ? <ChatBoard chatMessages={getChatMessages()} initiateWebRtc={initiateWebRtc}  chatPartner={chatPartner} sendParcel={sendParcel} userId={userId} setChatPartner={setChatPartner}/> 
            : <ContactList contactList={getContactList()} setChatPartner={setChatPartner} />)
          : (
            <>
              <ContactList contactList={getContactList()} setChatPartner={setChatPartner} />
              <ChatBoard chatMessages={getChatMessages()} initiateWebRtc={initiateWebRtc} chatPartner={chatPartner} sendParcel={sendParcel} userId={userId} setChatPartner={setChatPartner}/> 
            </>
          )
        }
      </div>
    </>
  );
}

export default Chat;
