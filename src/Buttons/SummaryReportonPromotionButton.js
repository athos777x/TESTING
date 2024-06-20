import React from 'react';
import { useNavigate } from 'react-router-dom';

function SummaryReportonPromotionButton() {
  const navigate = useNavigate();

  const handleShowSummaryReportonPromotion = () => {
    navigate('/summary-report-promotion');
  };

  return (
    <button onClick={handleShowSummaryReportonPromotion}>--Summary Report on Promotion</button>
  );
}

export default SummaryReportonPromotionButton;
