// SchoolYearButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SchoolYearButton() {
  const navigate = useNavigate();
  
  const handleShowSchoolYear = () => {
    navigate('/school-year');
  };

  return (
    <button onClick={handleShowSchoolYear}>--School Year</button>
  );
}

export default SchoolYearButton;
