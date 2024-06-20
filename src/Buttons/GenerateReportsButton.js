// GenerateReportsButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function GenerateReportsButton() {
  const navigate = useNavigate();

  const handleGenerateReports = () => {
    navigate('/generate-reports');
  };

  return (
    <button onClick={handleGenerateReports}>Generate Reports</button>
  );
}

export default GenerateReportsButton;
