import React from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';

const Navigation = () => {
  return (
    <Menu left>
        <Link to="/Settings">Settings</Link>
    </Menu>
  );
}

export default Navigation;
