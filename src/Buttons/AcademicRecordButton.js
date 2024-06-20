// AcademicRecordButton.js
import React from 'react';
import { FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AcademicRecordButton() {
  const navigate = useNavigate();
  
  const handleShowAcademicRecord = () => {
    navigate('/academic-record');
  };

  return (
    <button onClick={handleShowAcademicRecord}>
      <FaBook className="icon" /> Academic Record
    </button>
  );
}

export default AcademicRecordButton;
