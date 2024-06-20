import React from 'react';
import { useNavigate } from 'react-router-dom';

function ListofStudentEnrolleesButton() {
  const navigate = useNavigate();

  const handleShowListofStudentEnrollees = () => {
    navigate('/list-of-student-enrollees');
  };

  return (
    <button onClick={handleShowListofStudentEnrollees}>--List of Student Enrollees</button>
  );
}

export default ListofStudentEnrolleesButton;
