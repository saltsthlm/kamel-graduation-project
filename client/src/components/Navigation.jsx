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
            <Link to="/chat">Chat</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navigation;
