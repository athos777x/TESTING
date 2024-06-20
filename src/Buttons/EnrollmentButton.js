// EnrollmentButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function EnrollmentButton() {
  const navigate = useNavigate();
  
  const handleShowEnrollment = () => {
    navigate('/enrollment');
  };

  return (
    <button onClick={handleShowEnrollment}>Enrollment</button>
  );
}

export default EnrollmentButton;
