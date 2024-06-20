// StudentsButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function StudentsButton() {
  const navigate = useNavigate();
  
  const handleShowStudents = () => {
    navigate('/students');
  };

  return (
    <button onClick={handleShowStudents}>Students</button>
  );
}

export default StudentsButton;
