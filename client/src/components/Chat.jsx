import React from "react";
import { Block } from "jsxstyle";

function Chat({ chatMessages, chatPartner }) {
  console.log(chatMessages, chatPartner);
  const messages = (chatPartner && chatMessages[chatPartner]) ? chatMessages[chatPartner] : [];
  return (
    <div className="chat">
      <ul>
        {messages.map((parcel, i) => (
          <Block listStyle='none'>
            <li key={i}>{parcel.translatedMessage}</li>
            <li key={i}>{parcel.message}</li>
            <li key={i}>{parcel.senderId}</li>
            <li key={i}>{parcel.receiverId}</li>

          </Block>
        ))}
      </ul>
    </div>
  );
}

export default Chat;
