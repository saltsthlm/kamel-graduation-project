import React, { useEffect } from "react";
import MessageEditor from '../MessageEditor/MessageEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

const getMessageStyle = (senderId, userId) => {
  if (senderId === userId) {
    return {
      float: 'right',
      clear:'both',
      marginLeft: '20px',
    }
  } else  {
    return {
      float: 'left',
      clear:'both',
      marginRight: '20px',
    }
  }
}

function ChatBoard({ chatMessages, chatPartner, sendMessage, setChatPartner, userId }) {
  let messageArea = React.createRef();

  useEffect(() => {
    messageArea.current.scrollTop = messageArea.current.scrollHeight;
  }, [chatMessages, messageArea])

  return (
    <div className="chat-board">
      <FontAwesomeIcon icon={faAngleLeft} onClick={() => setChatPartner({})} />
      <h3>{chatPartner.userName ? chatPartner.userName : 'Select contact'}</h3>
      <div className="chat-board_messages" ref={messageArea}>
        <ul>
          {chatMessages.map((parcel, i) => (
            <div key={i} className='chat-board_message' style={getMessageStyle(parcel.senderId, userId)}>
              <li key={Math.random()}>{parcel.translatedMessage}</li>
              <li key={Math.random()}>{parcel.message}</li>
            </div>
          ))}
        </ul>
      </div>
      {chatPartner.userName ? <MessageEditor sendMessage={sendMessage} /> : ''}
    </div>
  );
}

export default ChatBoard;
