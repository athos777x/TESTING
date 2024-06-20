// AttendanceButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function AttendanceButton() {
  const navigate = useNavigate();
  
  const handleShowAttendance = () => {
    navigate('/attendance');
  };

  return (
    <button onClick={handleShowAttendance}>--Attendance</button>
  );
}

export default AttendanceButton;
