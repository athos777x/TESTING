// EnrolledStudentsButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function EnrolledStudentsButton() {
  const navigate = useNavigate();
  
  const handleShowEnrolledStudents = () => {
    navigate('/enrolled-students');
  };

  return (
    <button onClick={handleShowEnrolledStudents}>--Enrolled Students</button>
  );
}

export default EnrolledStudentsButton;
