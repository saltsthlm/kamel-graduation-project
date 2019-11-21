import React from "react";

function ContactList({ contactList, setChatPartner }) {

  const establishConnection = event => {
    setChatPartner(event.target.innerText);
  };


  return (
    <div className="contact-list">
      <h3>Active Users</h3>
      <ul>
        {contactList.map((contact, i) => (
          <li key={i} onClick={establishConnection}>
            {contact.clientId}
            {contact.clientName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
