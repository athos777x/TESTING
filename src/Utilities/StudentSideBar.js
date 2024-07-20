import React, { useState } from 'react';
import '../CssFiles/sidebar.css';
import {
  FiHome,
  FiUser,
  FiBook,
  FiCalendar,
  FiClipboard,
  FiLogOut,
  FiMenu,
  FiChevronLeft
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function StudentSideBar({ showSidebar, toggleSidebar, handleLogout }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${showSidebar ? 'show' : 'hide'}`} style={{ zIndex: 1100 }}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {showSidebar ? <FiChevronLeft /> : <FiMenu />}
      </button>
      <div className="buttons">
        <button onClick={() => handleNavigate('/home')}>
          <FiHome className="icon" /> Home
        </button>
        <button onClick={() => handleNavigate('/profile')}>
          <FiUser className="icon" /> Profile
        </button>
        <button onClick={() => handleNavigate('/academic-record')}>
          <FiBook className="icon" /> Academics
        </button>
        <button onClick={() => handleNavigate('/enrollment')}>
          <FiClipboard className="icon" /> Enrollment
        </button>
        <button onClick={() => handleNavigate('/schedule')}>
          <FiCalendar className="icon" /> Schedule
        </button>
        <button onClick={() => handleLogout()}>
          <FiLogOut className="icon" /> Logout
        </button>
      </div>
    </div>
  );
}

export default StudentSideBar;
