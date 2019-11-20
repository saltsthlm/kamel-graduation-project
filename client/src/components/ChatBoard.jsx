import React from "react";
import { Block } from "jsxstyle";

function ChatBoard({ chatMessages, chatPartner }) {

  const messages = (chatPartner && chatMessages[chatPartner]) ? chatMessages[chatPartner] : [];
  return (
    <div className="chat">
     <h3>You are talking to:{chatPartner}</h3>
     <p> Recieve messages: </p>
      <ul>
        {messages.map((parcel, i) => (
          <Block listStyle='none' key={i}>
            <li key={Math.random()}>{parcel.translatedMessage}</li>
            <li key={Math.random()}>{parcel.message}</li>
            <li key={Math.random()}>{parcel.senderId}</li>
            <li key={Math.random()}>{parcel.receiverId}</li>
          </Block>
        ))}
      </ul>
    </div>
  );
}

export default ChatBoard;
