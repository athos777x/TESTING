import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../StudentPagesCss/Student_ProfilePage.css';

function Student_ProfilePage() {
  const [studentData, setStudentData] = useState(null);
  const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/student/profile/${userId}`);
        setStudentData(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [userId]);

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <p><strong>Full Name:</strong> {`${studentData.firstname} ${studentData.middlename} ${studentData.lastname}`}</p>
      <p><strong>Username:</strong> {studentData.username}</p>
      <p><strong>Gender:</strong> {studentData.gender}</p>
      <p><strong>Birthdate:</strong> {studentData.birthdate}</p>
      <p><strong>Address:</strong> {`${studentData.home_address}, ${studentData.barangay}, ${studentData.city_municipality}, ${studentData.province}`}</p>
      <p><strong>Contact Number:</strong> {studentData.contact_number}</p>
      <p><strong>Email Address:</strong> {studentData.email_address}</p>
      <p><strong>Mother's Name:</strong> {studentData.mother_name}</p>
      <p><strong>Father's Name:</strong> {studentData.father_name}</p>
      {/* Add more fields as needed */}
    </div>
  );
}

export default Student_ProfilePage;
