import React from "react";

function ContactList({ contactList, setChatPartner }) {

  const establishConnection = (userId) => {
    setChatPartner(userId);
  };

  return (
    <div className="contact-list">
      <h3>Active Users</h3>
      <ul>
        {contactList.map((contact, i) => (
          <li key={i} onClick={() => establishConnection(contact.userId)}>
            {contact.userName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
