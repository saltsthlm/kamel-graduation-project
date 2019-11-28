import React from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const Navigation = ({logout}) => {

  return (
    <>
      <div className='bm-burger-button'>
        <FontAwesomeIcon className="menu-icon" icon={faCog}/>
      </div>
      <Menu left>
        <Link to="/" onClick={logout}>Log Out</Link>
      </Menu>
    </>
  );
}

export default Navigation;
