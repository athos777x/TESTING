// GradesButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function GradesButton() {
  const navigate = useNavigate();

  const handleShowGrades = () => {
    navigate('/grades');
  };

  return (
    <button onClick={handleShowGrades}>--Grades</button>
  );
}

export default GradesButton;
