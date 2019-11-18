import React, {useState, useEffect} from 'react';

function ContactList({ contactList }) {
  const establishConnection = (event) => {
    console.log(event.target.innerText)
  }

  return (
    <div className="contact-list">
      <h3>Active Users</h3>
      <ul>
        {contactList.map((contact, i) => <li key={i} onClick={establishConnection}>{contact}</li>)}
      </ul>
    </div>
  );
}

export default ContactList;
