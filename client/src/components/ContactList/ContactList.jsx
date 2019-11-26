import React from "react";
import ISO6391 from 'iso-639-1';

function ContactList({ contactList, setChatPartner }) {

  const establishConnection = (contact) => {
    setChatPartner(contact);
  };

  const getImage = (userName) => {
    switch (userName) {
    case 'Moritz':
      return './moritz.png';
    default:
      return '/logo512.png'
    }
  }

  return (
    <div className='contact-list'>
      <h3>Contacts</h3>
      <div className='contact-list_wrapp'>
        <ul>
          {contactList.map((contact, i) => (
            <li key={i}>
              <div>
                <img className='contact-list_wrapp_portrait' onClick={() => establishConnection(contact)} src={getImage(contact.userName)}/>
              </div>
              <div className='contact-list_wrapp_details'>
                <span className='contact-list_wrapp_details_name' onClick={() => establishConnection(contact)}>{contact.userName}</span>
                <span className='contact-list_wrapp_details_language'>({ISO6391.getName(contact.language)})</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ContactList;
