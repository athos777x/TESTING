// PrincipalSideBar.js
import React, { useState } from 'react';
import '../CssFiles/principaldashboard.css';
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiBook,
  FiLogOut,
  FiChevronLeft,
  FiMenu,
  FiUser,
  FiCalendar,
  FiBarChart2,
  FiFileText,
  FiCheckSquare
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../Buttons/HomeButton';
import AttendanceButton from '../Buttons/AttendanceButton';
import EmployeeButton from '../Buttons/EmployeeButton';
import SchoolYearButton from '../Buttons/SchoolYearButton';
import EnrolledStudentsButton from '../Buttons/EnrolledStudentsButton';
import SectionButton from '../Buttons/SectionButton';
import SubjectsButton from '../Buttons/SubjectsButton';
import LogoutButton from '../Buttons/LogoutButton';
import ListofStudentEnrolleesButton from '../Buttons/ListofStudentEnrolleesButton';
import SummaryReportonPromotionButton from '../Buttons/SummaryReportonPromotionButton';
import EarlyEnrollmentReportButton from '../Buttons/EarlyEnrollmentReportButton';

function PrincipalSideBar({ showSidebar, toggleSidebar, handleLogout }) {
  const [showRecordsSubMenu, setShowRecordsSubMenu] = useState(false);
  const [showEnrollmentSubMenu, setShowEnrollmentSubMenu] = useState(false);
  const [showReportsSubMenu, setShowReportsSubMenu] = useState(false);
  const navigate = useNavigate();

  const toggleRecordsSubMenu = () => {
    setShowRecordsSubMenu(!showRecordsSubMenu);
    setShowEnrollmentSubMenu(false);
    setShowReportsSubMenu(false);
  };

  const toggleEnrollmentSubMenu = () => {
    setShowEnrollmentSubMenu(!showEnrollmentSubMenu);
    setShowRecordsSubMenu(false);
    setShowReportsSubMenu(false);
  };

  const toggleReportsSubMenu = () => {
    setShowReportsSubMenu(!showReportsSubMenu);
    setShowRecordsSubMenu(false);
    setShowEnrollmentSubMenu(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${showSidebar ? 'show' : 'hide'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {showSidebar ? <FiChevronLeft /> : <FiMenu />}
      </button>
      <div className="buttons">
        <button onClick={() => handleNavigate('/home')}>
          <FiHome className="icon" /> Home
        </button>
        <button onClick={() => handleNavigate('/students')}>
          <FiUsers className="icon" /> Students
        </button>
        <div className={`menu-with-submenu ${showRecordsSubMenu ? 'active' : ''}`}>
          <button onClick={toggleRecordsSubMenu}>
            <FiClipboard className="icon" /> Student Academic Records
          </button>
          {showRecordsSubMenu && (
            <div className="submenu">
              <button onClick={() => handleNavigate('/grades')}>
                <FiFileText className="icon" /> Grades
              </button>
              <button onClick={() => handleNavigate('/attendance')}>
                <FiCheckSquare className="icon" /> Attendance
              </button>
            </div>
          )}
        </div>
        <button onClick={() => handleNavigate('/employees')}>
          <FiUser className="icon" /> Employee
        </button>
        <div className={`menu-with-submenu ${showEnrollmentSubMenu ? 'active' : ''}`}>
          <button onClick={toggleEnrollmentSubMenu}>
            <FiCalendar className="icon" /> Enrollment
          </button>
          {showEnrollmentSubMenu && (
            <div className="submenu">
              <button onClick={() => handleNavigate('/schoolyear')}>
                <FiCalendar className="icon" /> School Year
              </button>
              <button onClick={() => handleNavigate('/section')}>
                <FiBook className="icon" /> Section
              </button>
              <button onClick={() => handleNavigate('/enrolledstudents')}>
                <FiUsers className="icon" /> Enrolled Students
              </button>
            </div>
          )}
        </div>
        <button onClick={() => handleNavigate('/subjects')}>
          <FiBook className="icon" /> Subjects
        </button>
        <div className={`menu-with-submenu ${showReportsSubMenu ? 'active' : ''}`}>
          <button onClick={toggleReportsSubMenu}>
            <FiBarChart2 className="icon" /> Generate Reports
          </button>
          {showReportsSubMenu && (
            <div className="submenu">
              <button onClick={() => handleNavigate('/studentenrollees')}>
                <FiUsers className="icon" /> List of Student Enrollees
              </button>
              <button onClick={() => handleNavigate('/summaryreport')}>
                <FiFileText className="icon" /> Summary Report
              </button>
              <button onClick={() => handleNavigate('/earlyenrollmentreport')}>
                <FiFileText className="icon" /> Early Enrollment Report
              </button>
            </div>
          )}
        </div>
        <LogoutButton onClick={handleLogout}>
          <FiLogOut className="icon" /> Logout
        </LogoutButton>
      </div>
    </div>
  );
}

export default PrincipalSideBar;
