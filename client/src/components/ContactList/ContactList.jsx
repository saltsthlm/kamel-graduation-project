import React from "react";
import ISO6391 from 'iso-639-1';

function ContactList({ contactList, setChatPartner }) {

  const establishConnection = (contact) => {
    setChatPartner(contact);
  };

  return (
    <div className='contact-list'>
      <h3>Contacts</h3>
      <div className='contact-list_wrapp'>
        <ul>
          {contactList.map((contact, i) => (
            <li key={i} onClick={() => establishConnection(contact)}>
              {contact.userName} ({ISO6391.getName(contact.language)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ContactList;
