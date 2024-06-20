// HomeButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomeButton() {
  const navigate = useNavigate();
  
  const handleShowHome = () => {
    navigate('/home');
  };

  return (
    <button onClick={handleShowHome}>Home</button>
  );
}

export default HomeButton;
