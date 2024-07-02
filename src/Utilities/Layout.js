// Layout.js
import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import HeaderBar from './HeadBar';
import StudentSideBar from './StudentSideBar';
import PrincipalSideBar from './PrincipalSideBar';

function Layout({ role, handleLogout }) {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const user = {
    fullName: localStorage.getItem('fullName') || 'Full Name',
    name: localStorage.getItem('username') || 'User',
    role: localStorage.getItem('role') || 'Role'
  };

  if (!localStorage.getItem('isAuthenticated')) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <HeaderBar showSidebar={showSidebar} toggleSidebar={toggleSidebar} user={user} />
      {role === 'student' && (
        <StudentSideBar showSidebar={showSidebar} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
      )}
      {role === 'principal' && (
        <PrincipalSideBar showSidebar={showSidebar} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
      )}
      <div className={`content ${showSidebar ? 'content-shift' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
