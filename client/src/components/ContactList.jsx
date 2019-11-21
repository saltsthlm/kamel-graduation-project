import React from "react";

function ContactList({ contactList, setChatPartner }) {

  const establishConnection = (contact) => {
    setChatPartner(contact);
  };

  return (
    <div className="contact-list">
      <h3>Active Users</h3>
      <ul>
        {contactList.map((contact, i) => (
          <li key={i} onClick={() => establishConnection(contact)}>
            {contact.userName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
