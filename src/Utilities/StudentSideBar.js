// StudentSideBar.js
import React from 'react';
import '../CssFiles/studentdashboard.css';
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
import ProfileButton from '../Buttons/ProfileButton';
import AcademicRecordButton from '../Buttons/AcademicRecordButton';
import EnrollmentButton from '../Buttons/EnrollmentButton';
import SectionButton from '../Buttons/SectionButton';
import LogoutButton from '../Buttons/LogoutButton';

function StudentSideBar({ showSidebar, toggleSidebar, handleLogout }) {
  return (
    <div className={`sidebar ${showSidebar ? 'show' : 'hide'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {showSidebar ? <FiChevronLeft /> : <FiMenu />}
      </button>
      <div className="buttons">
        <ProfileButton>
          <FiUser className="icon" /> Profile
        </ProfileButton>
        <AcademicRecordButton>
          <FiClipboard className="icon" /> Academic Record
        </AcademicRecordButton>
        <EnrollmentButton>
          <FiCalendar className="icon" /> Enrollment
        </EnrollmentButton>
        <SectionButton>
          <FiBook className="icon" /> Section
        </SectionButton>
        <LogoutButton onClick={handleLogout}>
          <FiLogOut className="icon" /> Logout
        </LogoutButton>
      </div>
    </div>
  );
}

export default StudentSideBar;
