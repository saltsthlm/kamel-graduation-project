import React, { useState, useEffect, useCallback } from 'react';
import ContactList from '../ContactList/ContactList';
import ChatBoard from '../ChatBoard/ChatBoard';
import { updateChatMessages, updateContactList } from '../../lib/chat';
import useWindowDimensions from '../../lib/window';

function Chat({ userId, socket }) {
  const { width } = useWindowDimensions();
  const [contactList, setContactList] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [chatPartner, setChatPartner] = useState({});

  const socketSetupCallback = useCallback(() => (
    updateContactList(userId, socket)
  ), [userId, socket])
 
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
          socket.send(JSON.stringify({
            type: 'RETURN PONG',
            message: 'connection still open',
            senderId: parcel.receiverId
          }));
        }
        if (parcel.type === 'OFFER WEBRTC') {
          console.log(parcel);
        }
      }
      socketSetupCallback();
    }
  }, [socket, socketSetupCallback])

  const sendParcel = (type, kwargs) => {
    const parcel = {
      type,
      receiverId: chatPartner.userId,
      senderId: userId,
      timeStamp: Date.now(),
      ...kwargs,
    };

    if (parcel.type === 'DIRECT MESSAGE') {
      setChatMessages((messages) => updateChatMessages(messages, parcel, parcel.receiverId));
    }

    socket.send(JSON.stringify(parcel));
  };

  const getChatMessages = () => (
    chatPartner.userId && chatMessages[chatPartner.userId]
      ? chatMessages[chatPartner.userId] 
      : []
  )

  const getContactList = () => contactList.filter((contact) => contact.userId !== userId);

  return (
    <>
      <div className="chat">
        { (width < 700 )
          ? (chatPartner.userName 
            ? <ChatBoard chatMessages={getChatMessages()} chatPartner={chatPartner} sendParcel={sendParcel} userId={userId} setChatPartner={setChatPartner}/> 
            : <ContactList contactList={getContactList()} setChatPartner={setChatPartner} />)
          : (
            <>
              <ContactList contactList={getContactList()} setChatPartner={setChatPartner} />
              <ChatBoard chatMessages={getChatMessages()} chatPartner={chatPartner} sendParcel={sendParcel} userId={userId} setChatPartner={setChatPartner}/> 
            </>
          )
        }
      </div>
    </>
  );
}

export default Chat;
