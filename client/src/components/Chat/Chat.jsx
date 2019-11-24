import React, { useState, useEffect, useCallback } from 'react';
import ContactList from '../ContactList/ContactList';
import ChatBoard from '../ChatBoard/ChatBoard';
import { updateChatMessages, updateContactList } from '../../lib/chat';
import useWindowDimensions from '../../lib/window';
import * as webRtc from '../../lib/webrtc';
import VideoChat from '../VideoChat/VideoChat';
import * as parcels from '../../lib/parcels';

function Chat({ user, socket }) {
  // general chat-related state
  const { width } = useWindowDimensions();
  const [contactList, setContactList] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [chatPartner, setChatPartner] = useState({});

  // video-chat-related state
  const [webRtcPeer, setWebRtcPeer] = useState(false);
  const [webRtcSignal, setWebRtcSignal] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState(false);
  const [subTitles, setSubTitles] = useState('');

  const sendParcel = (type, kwargs) => {
    const parcel = parcels.getNewParcel(type, user, chatPartner, kwargs)
    socket.send(JSON.stringify(parcel));
    if (type === 'DIRECT MESSAGE') {
      setChatMessages((messages) => updateChatMessages(messages, parcel, parcel.receiverId));
    }
  };

  const socketSetupCallback = useCallback(() => (
    updateContactList(user.userId, socket)
  ), [user.userId, socket]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        parcels.processParcel({
          event,
          setContactList,
          setChatMessages,
          updateChatMessages,
          socket,
          setWebRtcSignal,
          setSubTitles
        })
      }
      socketSetupCallback();
    }
  }, [socket, socketSetupCallback])

  useEffect(() => {
    if (webRtcSignal && !webRtcPeer) {
      const peer = webRtc.newPeer();
      peer.signal(webRtcSignal);
      setWebRtcPeer(peer);
    } else if (webRtcSignal && webRtcPeer) {
      webRtcPeer.signal(webRtcSignal);
    }
  // eslint-disable-next-line 
  }, [webRtcSignal])

  // set-up WebRTC listeners once WebRTC client is initiated
  useEffect(() => {    
    if (webRtcPeer) {
      webRtc.setupListeners({
        webRtcPeer,
        language: user.language,
        chatPartner,
        sendParcel,
        setActiveVideoCall,
        setWebRtcPeer,
        setWebRtcSignal
      })
    }
  // eslint-disable-next-line 
  }, [webRtcPeer, activeVideoCall]);

  // initiate new WebRTC connection
  const initiateWebRtc = (event) => {
    event.preventDefault();
    setWebRtcPeer(webRtc.newInitiator());
  }

  const getChatMessages = () => (
    chatPartner.userId && chatMessages[chatPartner.userId]
      ? chatMessages[chatPartner.userId] 
      : []
  )

  const getContactList = () => contactList.filter((contact) => contact.userId !== user.userId);

  return (
    <>
      <div className="chat" style={{display: activeVideoCall ? 'none' : ''}}>
        { (width < 700 )
          ? (chatPartner.userName 
            ? <ChatBoard chatMessages={getChatMessages()} initiateWebRtc={initiateWebRtc} chatPartner={chatPartner} sendParcel={sendParcel} userId={user.userId} setChatPartner={setChatPartner}/> 
            : <ContactList contactList={getContactList()} setChatPartner={setChatPartner} />)
          : (
            <>
              <ContactList contactList={getContactList()} setChatPartner={setChatPartner} />
              <ChatBoard chatMessages={getChatMessages()} initiateWebRtc={initiateWebRtc} chatPartner={chatPartner} sendParcel={sendParcel} userId={user.userId} setChatPartner={setChatPartner}/> 
            </>
          )
        }
      </div>
      <VideoChat
        setWebRtcPeer={setWebRtcPeer}
        webRtcPeer={webRtcPeer}
        setWebRtcSignal={setWebRtcSignal}
        activeVideoCall={activeVideoCall}
        subTitles={subTitles}
        setSubTitles={setSubTitles}/>
    </>
  );
}

export default Chat;
