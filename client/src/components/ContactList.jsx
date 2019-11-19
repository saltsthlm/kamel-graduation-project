import React from "react";

function ContactList({ contactList, sendMessage }) {
  const establishConnection = event => {
    sendMessage(
      event.target.innerText,
      "Hi my name is Leo and I like cupcakes filled with cheese"
    );
  };

  return (
    <div className="contact-list">
      <h3>Active Users</h3>
      <ul>
        {contactList.map((contact, i) => (
          <li key={i} onClick={establishConnection}>
            {contact}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
