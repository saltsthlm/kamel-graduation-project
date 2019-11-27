import React from "react";
import ISO6391 from 'iso-639-1';

function ContactList({ contactList, setChatPartner, getImage }) {

  const establishConnection = (contact) => {
    setChatPartner(contact);
  };


  return (
    <div className='contact-list'>
      <h3 className='contact-list_header'>Contacts</h3>
      <div className='contact-list_wrapp'>
        <ul>
          {contactList.map((contact, i) => (
            <li key={i}>
              <div>
                <img alt='portrait' className='contact-list_wrapp_portrait' onClick={() => establishConnection(contact)} src={getImage(contact.userName)}/>
              </div>
              <div className='contact-list_wrapp_details'>
                <span className='contact-list_wrapp_details_name' onClick={() => establishConnection(contact)}>{contact.userName}</span>
                <span className='contact-list_wrapp_details_language'>{ISO6391.getName(contact.language)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ContactList;
