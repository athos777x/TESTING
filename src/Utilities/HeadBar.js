// HeadBar.js
import React from 'react';
import '../CssFiles/headbar.css';
import { FaBars, FaTimes } from 'react-icons/fa';

function HeaderBar({ showSidebar, toggleSidebar }) {
  return (
    <div className="header">
      <button className="toggle-btn" onClick={toggleSidebar}>
        {showSidebar ? <FaTimes /> : <FaBars />}
      </button>
      <h1>LNHS - MIS</h1>
    </div>
  );
}

export default HeaderBar;
