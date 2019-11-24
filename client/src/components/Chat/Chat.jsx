import React, { useState, useEffect, useCallback } from 'react';
import ContactList from '../ContactList/ContactList';
import ChatBoard from '../ChatBoard/ChatBoard';
import { updateChatMessages, updateContactList } from '../../lib/chat';
import useWindowDimensions from '../../lib/window';
import * as webRtc from '../../lib/webrtc';
import VideoChat from '../VideoChat/VideoChat';
import { recognizeSpeech } from '../../lib/speechToText';

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
  const [activeVideoCall, setActiveVideoCall] = useState(false);

  const socketSetupCallback = useCallback(() => (
    updateContactList(userId, socket)
  ), [userId, socket]);

  const sendParcel = (type, kwargs) => {
    const parcelTemplate = {
      receiverId: chatPartner.userId,
      senderId: userId,
      timeStamp: Date.now()
    };

    const parcel = {
      type,
      ...parcelTemplate,
      ...kwargs,
    };

    socket.send(JSON.stringify(parcel));
  
    if (parcel.type === 'DIRECT MESSAGE') {
      setChatMessages((messages) => updateChatMessages(messages, parcel, parcel.receiverId));
    }
  };

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
  // eslint-disable-next-line 
  }, [webRtcSignal])

  // set-up WebRTC listeners once WebRTC client is initiated
  useEffect(() => {    
    if (webRtcPeer) {
      webRtcPeer.on('connect', () => {
        webRtcPeer.send('ready when you are ');
        recognizeSpeech(
          (transcript) => sendParcel('TRANSLATE SUBTITLES', {message: transcript}),
          console.log,
          console.log,
          console.log);
      });
      webRtcPeer.on('close', () => setActiveVideoCall(false));
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
      navigator.mediaDevices.getUserMedia(webRtc.videoConfig)
        .then((stream) => webRtcPeer.addStream(stream));
    }
  // eslint-disable-next-line 
  }, [webRtcPeer, activeVideoCall]);

  // initiate new WebRTC connection
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
        if (parcel.type === 'TRANSLATE SUBTITLES') {
          console.log(parcel.translatedMessage);
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

  return (
    <>
      <div className="chat" style={{display: activeVideoCall ? 'none' : ''}}>
        { (width < 700 )
          ? (chatPartner.userName 
            ? <ChatBoard chatMessages={getChatMessages()} initiateWebRtc={initiateWebRtc} chatPartner={chatPartner} sendParcel={sendParcel} userId={userId} setChatPartner={setChatPartner}/> 
            : <ContactList contactList={getContactList()} setChatPartner={setChatPartner} />)
          : (
            <>
              <ContactList contactList={getContactList()} setChatPartner={setChatPartner} />
              <ChatBoard chatMessages={getChatMessages()} initiateWebRtc={initiateWebRtc} chatPartner={chatPartner} sendParcel={sendParcel} userId={userId} setChatPartner={setChatPartner}/> 
            </>
          )
        }
      </div>
      <VideoChat
        setWebRtcPeer={setWebRtcPeer}
        webRtcPeer={webRtcPeer}
        setWebRtcSignal={setWebRtcSignal}
        activeVideoCall={activeVideoCall} />
    </>
  );
}

export default Chat;
