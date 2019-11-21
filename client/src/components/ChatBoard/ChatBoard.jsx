import React from "react";
import MessageEditor from '../MessageEditor/MessageEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

function ChatBoard({ chatMessages, chatPartner, sendMessage, setChatPartner, userId }) {

  return (
    <div className="chat-board">
      <FontAwesomeIcon icon={faAngleLeft} onClick={() => setChatPartner({})} />
      <div className="chat-board_messages">
        <h3>{chatPartner.userName ? chatPartner.userName : 'Select contact'}</h3>
        <ul>
          {chatMessages.map((parcel, i) => (
            <div className='chat-board_message' style={parcel.receiverId !== userId ? {float: 'left', clear:'both'} : {float: 'right', clear:'both'}}>
              <li key={Math.random()}>{parcel.translatedMessage}</li>
              <li key={Math.random()}>{parcel.message}</li>
             
            </div>
          ))}
        </ul>
      </div>
      <MessageEditor sendMessage={sendMessage} />
    </div>
  );
}

export default ChatBoard;

   {/* <li key={Math.random()}>{parcel.senderId}</li>
              <li key={Math.random()}>{parcel.receiverId}</li> */}