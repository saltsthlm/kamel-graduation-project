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
            <Link to="/">Chat</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navigation;
