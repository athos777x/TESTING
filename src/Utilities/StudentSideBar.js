// StudentSideBar.js
import React from 'react';
import '../CssFiles/sidebar.css';
import {
  FiUser,
  FiBook,
  FiClipboard,
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiCalendar,
  FiFileText,
  FiCheckSquare
} from 'react-icons/fi';


function StudentSideBar({ showSidebar, toggleSidebar, handleLogout }) {
  return (
    <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
      {/* Your sidebar content goes here */}
    </div>
  );
}

export default StudentSideBar;
