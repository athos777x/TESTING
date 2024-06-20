// SectionButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SectionButton() {
  const navigate = useNavigate();
  
  const handleShowSection = () => {
    navigate('/section');
  };

  return (
    <button onClick={handleShowSection}>--Section</button>
  );
}

export default SectionButton;
