import React, { useState, useEffect } from "react";
import { Block } from "jsxstyle";

function Chat({ chatMessages }) {
  return (
    <div className="chat">
      <ul>
        {chatMessages.map((parcel, i) => (
          <Block>
            <li key={i}>{parcel.translatedMessage}</li>
            <li key={i}>{parcel.message}</li>
          </Block>
        ))}
      </ul>
    </div>
  );
}

export default Chat;
