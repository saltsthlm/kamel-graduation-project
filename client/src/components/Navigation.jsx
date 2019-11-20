import React from "react";
import { Link } from "react-router-dom";

const ulStyle = {
    listStyle: 'none',
} 
const Navigation = () => {
  return (
    <>
        <nav>
          <ul style={ulStyle}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/chat">Chat</Link>
            </li>
            <li>
              <Link to="/contacts">Contacts</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
    </>
  );
}

export default Navigation;
