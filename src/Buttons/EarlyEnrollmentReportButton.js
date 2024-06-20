import React from 'react';
import { useNavigate } from 'react-router-dom';

function EarlyEnrollmentReportButton() {
  const navigate = useNavigate();

  const handleShowEarlyEnrollmentReport = () => {
    navigate('/early-enrollment-report');
  };

  return (
    <button onClick={handleShowEarlyEnrollmentReport}>--Early Enrollment Report</button>
  );
}

export default EarlyEnrollmentReportButton;
