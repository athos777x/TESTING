import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../CssPage/StudentDetailPage.css';

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/students/${id}/details`);
        const details = response.data[0];
        if (details.birthdate) {
          const birthdate = new Date(details.birthdate);
          details.birthdate = birthdate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        }
        setStudentDetails(details);
        console.log("Student Details Keys:", Object.keys(details)); // Debugging line
      } catch (error) {
        setError('There was an error fetching the student details!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  const handleDownload = () => {
    if (!studentDetails) return;

    const doc = new jsPDF();
    const tableRows = [];

    Object.entries(studentDetails).forEach(([key, value]) => {
      if (key !== 'firstname' && key !== 'lastname') {
        const rowData = [transformKey(key), String(value) || ''];
        tableRows.push(rowData);
      }
    });

    doc.setFontSize(18);
    doc.text(`${studentDetails.firstname} ${studentDetails.lastname}`, 14, 22);
    doc.autoTable({
      startY: 30,
      body: tableRows,
      theme: 'grid',
      styles: { cellPadding: 2, fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 'auto' }
      }
    });

    doc.save(`${studentDetails.firstname}_${studentDetails.lastname}_Details.pdf`);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const headerMapping = {
    studentId: "Student ID",
    lastname: "Last Name",
    firstname: "First Name",
    middlename: "Middle Name",
    currentYearLevel: "Current Year Level",
    birthdate: "Birthdate",
    gender: "Gender",
    age: "Age",
    homeAddress: "Home Address",
    barangay: "Barangay",
    cityMunicipality: "City/Municipality",
    province: "Province",
    contactNumber: "Contact Number",
    emailAddress: "Email Address",
    motherName: "Mother's Name",
    fatherName: "Father's Name",
    parentAddress: "Parent Address",
    fatherOccupation: "Father's Occupation",
    motherOccupation: "Mother's Occupation",
    annualHouseholdIncome: "Annual Household Income",
    numberOfSiblings: "Number of Siblings",
    fatherEducationLevel: "Father's Education Level",
    motherEducationLevel: "Mother's Education Level",
    fatherContactNumber: "Father's Contact Number",
    motherContactNumber: "Mother's Contact Number",
    status: "Status",
    schoolYear: "School Year"
  };

  const transformKey = (key) => {
    console.log("Transforming Key:", key, "to", headerMapping[key] || key); // Debugging line
    return headerMapping[key] || key;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!studentDetails) {
    return <div>No details available for this student.</div>;
  }

  return (
    <div className="student-detail-container">
      <h1 className="student-detail-title">Student Details</h1>
      <p className="student-name-header">{`${studentDetails.firstname} ${studentDetails.lastname}`}</p>
      <table className="student-detail-table">
        <tbody>
          {Object.entries(studentDetails).map(([key, value]) => (
            <tr key={key}>
              <th>{transformKey(key)}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="download-button" onClick={handleDownload}>Download PDF</button>
      <button className="close-button" onClick={handleClose}>Close</button>
    </div>
  );
};

export default StudentDetailPage;
