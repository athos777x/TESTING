// SubjectsButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SubjectsButton() {
  const navigate = useNavigate();

  const handleShowSubjects = () => {
    navigate('/subjects');
  };

  return (
    <button onClick={handleShowSubjects}>Subjects</button>
  );
}

export default SubjectsButton;
