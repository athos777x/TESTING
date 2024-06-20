// ProfileButton.js
import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function ProfileButton() {
  const navigate = useNavigate();
  
  const handleShowProfile = () => {
    navigate('/profile');
  };

  return (
    <button onClick={handleShowProfile}>
      <FaUser className="icon" /> My Profile
    </button>
  );
}

export default ProfileButton;
