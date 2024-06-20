// EmployeeButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeButton() {
  const navigate = useNavigate();
  
  const handleShowEmployee = () => {
    navigate('/employee');
  };

  return (
    <button onClick={handleShowEmployee}>Employee</button>
  );
}

export default EmployeeButton;
