import React, { useEffect } from "react";
import MessageEditor from '../MessageEditor/MessageEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import ISO6391 from 'iso-639-1';


const getMessageStyle = (senderId, userId) => {
  if (senderId === userId) {
    return {
      float: 'right',
      clear:'both',
      marginLeft: '20px',
      backgroundColor: 'rgb(37, 55, 94)',
      color: 'white',
    }
  } else  {
    return {
      float: 'left',
      clear:'both',
      marginRight: '20px',
      backgroundColor: '#ddd',
      color: 'black',
    }
  }
}

const ChatBoard = ({ chatMessages, chatPartner, sendParcel, setChatPartner, userId, initiateWebRtc, getImage }) => {
  let messageArea = React.createRef();

  useEffect(() => {
    messageArea.current.scrollTop = messageArea.current.scrollHeight;
  }, [chatMessages, messageArea])


  return (
    <div className="chat-board">
      <div className='chat-board_back-icon'>
        <FontAwesomeIcon icon={faChevronCircleLeft} onClick={() => setChatPartner({})} />
      </div>
      <div>
        {chatPartner.userName ? <img alt='chatpartner' className="chat-board_img" src={getImage(chatPartner.userName)}/> : ''}
      </div>
      <h3 className="chat-board_header">{chatPartner.userName ? `${chatPartner.userName}` : 'Select a contact in the contactlist'}</h3>
      <p className="chat-board_paragraph">{chatPartner.userName ? `${ISO6391.getName(chatPartner.language)}` : ''}</p>
      <div className="chat-board_messages" ref={messageArea}>
        <ul>
          {chatMessages.map((parcel, i) => (
            <div key={i} className='chat-board_message' style={getMessageStyle(parcel.senderId, userId)}>
              {
                parcel.senderId === userId
                  ? <li key={Math.random()}>{parcel.message}</li>
                  : <li key={Math.random()}>{parcel.translatedMessage}</li>
              }
            </div>
          ))}
        </ul>
      </div>
      {chatPartner.userName ? <MessageEditor initiateWebRtc={initiateWebRtc} sendParcel={sendParcel} /> : ''}
    </div>
  );
}

export default ChatBoard;
