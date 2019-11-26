import React from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';
import SettingsIcon from "./SettingsIcon";

const Navigation = () => {
  return (
    <>
      <div className='bm-burger-button'>
        <SettingsIcon/>
      </div>
      <Menu left>
          <Link to="/settings">Settings</Link>
          <Link to="/">Log Out</Link>
      </Menu>
    </>
  );
}

export default Navigation;
