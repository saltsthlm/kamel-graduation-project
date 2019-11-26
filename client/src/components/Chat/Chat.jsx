import React, { useState, useEffect, useCallback } from 'react';
import ContactList from '../ContactList/ContactList';
import ChatBoard from '../ChatBoard/ChatBoard';
import { updateChatMessages, updateContactList } from '../../lib/chat';
import useWindowDimensions from '../../lib/window';
import * as webRtc from '../../lib/webrtc';
import VideoChat from '../VideoChat/VideoChat';
import * as parcels from '../../lib/parcels';
import Navigation from '../Navigation/Navigation';
import AcceptCallScreen from '../AcceptCallScreen/AcceptCallScreen';


function Chat({ user, socket }) {
  const { width } = useWindowDimensions();
  const [contactList, setContactList] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [chatPartner, setChatPartner] = useState({});

  const [webRtcPeer, setWebRtcPeer] = useState(false);
  const [webRtcFlag, setWebRtcFlag] = useState(false);
  const [webRtcSignal, setWebRtcSignal] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState(false);
  const [acceptCall, setAcceptCall] = useState(false);
  const [subTitles, setSubTitles] = useState('');

  const sendParcel = (type, kwargs) => {
    const parcel = parcels.getNewParcel(type, user.userId, chatPartner.userId, kwargs)
    socket.send(JSON.stringify(parcel));
    if (type === 'DIRECT MESSAGE') {
      setChatMessages((messages) => updateChatMessages(messages, parcel, parcel.receiverId));
    }
  };

  const initiateWebRtc = (event) => {
    event.preventDefault();
    setWebRtcPeer(webRtc.newInitiator());
  }

  const endWebRtc = () => {
    console.log('ending webrtc call')
    webRtcPeer.destroy();
    setWebRtcFlag(false);
    setWebRtcSignal(false);
    setWebRtcPeer(false);
    setActiveVideoCall(false);
    setSubTitles('');
    setAcceptCall(false);
  }

  const getChatMessages = () => (
    chatPartner.userId && chatMessages[chatPartner.userId]
      ? chatMessages[chatPartner.userId] 
      : []
  )

  const getContactList = () => contactList.filter((contact) => contact.userId !== user.userId);

  useEffect(() => {
    console.log('useEffect webRtcSignal')
    console.log('    webRtcSignal value', webRtcSignal)
    console.log('    webRtcPeer value', webRtcPeer)

    if (!acceptCall && webRtcSignal && webRtcSignal.type === 'offer') {
      return undefined;
    }
    if (webRtcSignal && !webRtcPeer) {
      const peer = webRtc.newPeer();
      peer.signal(webRtcSignal);
      setWebRtcPeer(peer);
    } else if (webRtcSignal && webRtcPeer) {
      webRtcPeer.signal(webRtcSignal);
    }
  // eslint-disable-next-line 
  }, [webRtcSignal, acceptCall])

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
    console.log('useEffect webRtcPeer')
    console.log('    webrct peer value', webRtcPeer)
    console.log('    activeVideoCall value', activeVideoCall)
    if (webRtcPeer && !webRtcFlag) {
      setWebRtcFlag(true);
      webRtc.setupListeners({
        webRtcPeer,
        language: user.language,
        chatPartner,
        sendParcel,
        setActiveVideoCall,
        setWebRtcPeer,
        setWebRtcSignal,
        endWebRtc,
      })
    }
  // eslint-disable-next-line
  }, [webRtcPeer, activeVideoCall]);


  const acceptCallScreenStyle = () => {
    console.log(webRtcPeer,  webRtcSignal, acceptCall)
    if ((webRtcSignal && !acceptCall) && !(webRtcSignal && webRtcPeer)) {
      return {
        display: 'flex',
        height: '100%',
      };
    } else {
      return {display: 'none'};
    }
  }

  return (
    <>
      <div className="chat" style={{display: webRtcSignal ? 'none' : ''}}>
        <Navigation/>
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
        endWebRtc={endWebRtc}
        setWebRtcFlag={setWebRtcFlag}
        webRtcPeer={webRtcPeer}
        setWebRtcSignal={setWebRtcSignal}
        activeVideoCall={activeVideoCall}
        subTitles={subTitles}
        setSubTitles={setSubTitles}/>
      <AcceptCallScreen setAcceptCall={setAcceptCall} endWebRtc={endWebRtc} css={acceptCallScreenStyle()}/>
    </>
  );
}

export default Chat;
