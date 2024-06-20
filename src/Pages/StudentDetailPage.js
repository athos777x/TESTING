import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../CssPage/StudentDetailPage.css'; // Import the CSS file

function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/students/${id}/details`)
      .then(response => {
        console.log('Student details fetched:', response.data); // Log the student details
        setStudent(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the student details!', error);
      });
  }, [id]);

  const downloadPDF = () => {
    const input = document.getElementById('student-detail-content');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20; // 10mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const margin = 10;

        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        pdf.save(`${student.name}_details.pdf`);
      });
  };

  const handleClose = () => {
    navigate('/students'); // Change this to the desired path
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-detail-container">
      <button onClick={handleClose} className="close-button">Close</button>
      <div id="student-detail-content">
        <h1 className="student-name-header">{student.name}</h1>
        <h2 className="student-detail-title">Student Details</h2>
        <table className="student-detail-table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{student.name}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{student.address}</td>
            </tr>
            <tr>
              <th>Phone Number</th>
              <td>{student.phone_number}</td>
            </tr>
            <tr>
              <th>School Year</th>
              <td>{student.school_year}</td>
            </tr>
            <tr>
              <th>Grade</th>
              <td>Grade {student.grade_level}</td>
            </tr>
            <tr>
              <th>Section</th>
              <td>{student.section}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{student.status}</td>
            </tr>
          </tbody>
        </table>
        <h2 className="student-detail-title">Grades</h2>
        {student.grades.length > 0 ? (
          <table className="student-detail-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
              </tr>
            </thead>
            <tbody>
              {student.grades.map((grade, index) => (
                <tr key={index}>
                  <td>{grade.subject_name}</td>
                  <td>{grade.q1_grade !== null ? grade.q1_grade : '-'}</td>
                  <td>{grade.q2_grade !== null ? grade.q2_grade : '-'}</td>
                  <td>{grade.q3_grade !== null ? grade.q3_grade : '-'}</td>
                  <td>{grade.q4_grade !== null ? grade.q4_grade : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No grades available.</p>
        )}
      </div>
      <button onClick={downloadPDF} className="download-button">Download PDF</button>
    </div>
  );
}

export default StudentDetailPage;
