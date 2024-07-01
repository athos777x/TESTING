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
  const [grades, setGrades] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
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
      } catch (error) {
        setError('There was an error fetching the student details!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStudentGrades = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/students/${id}/grades`);
        setGrades(response.data);
      } catch (error) {
        console.error('There was an error fetching the student grades!', error);
      }
    };

    const fetchStudentAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/attendance/${id}`);
        setAttendanceData(response.data);
      } catch (error) {
        console.error('There was an error fetching the student attendance!', error);
      }
    };

    fetchStudentDetails();
    fetchStudentGrades();
    fetchStudentAttendance();
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
      styles: { cellPadding: 2, fontSize: 10, lineWidth: 0.1, lineColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 'auto' }
      },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
    });

    // Add Grades table
    if (grades.length > 0) {
      const gradesTableRows = grades.map(grade => [
        grade.subject_name,
        grade.q1_grade,
        grade.q2_grade,
        grade.q3_grade,
        grade.q4_grade,
        calculateFinalGrade([grade.q1_grade, grade.q2_grade, grade.q3_grade, grade.q4_grade])
      ]);

      doc.addPage();
      doc.text('Grades', 14, 22);
      doc.autoTable({
        startY: 30,
        head: [
          [
            { content: `Grade Level: ${grades[0].grade_level}`, styles: { halign: 'left' } },
            { content: `School Year: ${grades[0].school_year}`, styles: { halign: 'right' } }
          ],
          ['Subject', 'Q1', 'Q2', 'Q3', 'Q4', 'Final Grade']
        ],
        body: gradesTableRows,
        theme: 'grid',
        styles: { cellPadding: 2, fontSize: 10, lineWidth: 0.1, lineColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
      });
    }

    // Add Attendance table
    if (attendanceData && Object.keys(attendanceData).length > 0) {
      const attendanceTableRows = [
        ['Total School Days', attendanceData.total_school_days],
        ['Total Days Present', attendanceData.days_present],
        ['Total Days Absent', attendanceData.days_absent],
        ['Total Days Late', attendanceData.days_late],
        ['Brigada Attendance', attendanceData.brigada_attendance],
      ];

      doc.addPage();
      doc.text('Attendance', 14, 22);
      doc.autoTable({
        startY: 30,
        head: [
          [
            { content: `Grade Level: ${grades.length > 0 ? grades[0].grade_level : ''}`, styles: { halign: 'left' } },
            { content: `School Year: ${grades.length > 0 ? grades[0].school_year : ''}`, styles: { halign: 'right' } }
          ]
        ],
        body: attendanceTableRows,
        theme: 'grid',
        styles: { cellPadding: 2, fontSize: 10, lineWidth: 0.1, lineColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
      });
    }

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
    return headerMapping[key] || key;
  };

  const calculateFinalGrade = (grades) => {
    const total = grades.reduce((sum, grade) => sum + grade, 0);
    return (total / grades.length).toFixed(2);
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
      <div className="grades-section">
        <h2>Grades</h2>
        {grades.length > 0 ? (
          <table className="grades-table">
            <thead>
              <tr>
                <th colSpan="6" style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '40px' }}>
                    <span>Grade Level: {grades[0].grade_level}</span>
                    <span>School Year: {grades[0].school_year}</span>
                  </div>
                </th>
              </tr>
              <tr>
                <th>Subject</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
                <th>Final Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => (
                <tr key={index}>
                  <td>{grade.subject_name}</td>
                  <td>{grade.q1_grade}</td>
                  <td>{grade.q2_grade}</td>
                  <td>{grade.q3_grade}</td>
                  <td>{grade.q4_grade}</td>
                  <td>{calculateFinalGrade([grade.q1_grade, grade.q2_grade, grade.q3_grade, grade.q4_grade])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No grades available.</p>
        )}
      </div>
      <div className="attendance-section">
        <h2>Attendance</h2>
        {attendanceData && Object.keys(attendanceData).length > 0 ? (
          <table className="attendance-table">
            <thead>
              <tr>
                <th colSpan="2" style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '40px' }}>
                    <span>Grade Level: {grades.length > 0 ? grades[0].grade_level : ''}</span>
                    <span>School Year: {grades.length > 0 ? grades[0].school_year : ''}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Total School Days</th>
                <td>{attendanceData.total_school_days}</td>
              </tr>
              <tr>
                <th>Total Days Present</th>
                <td>{attendanceData.days_present}</td>
              </tr>
              <tr>
                <th>Total Days Absent</th>
                <td>{attendanceData.days_absent}</td>
              </tr>
              <tr>
                <th>Total Days Late</th>
                <td>{attendanceData.days_late}</td>
              </tr>
              <tr>
                <th>Brigada Attendance</th>
                <td>{attendanceData.brigada_attendance}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No attendance records available.</p>
        )}
      </div>
      <button className="download-button" onClick={handleDownload}>Download PDF</button>
      <button className="close-button" onClick={handleClose}>Close</button>
    </div>
  );
};

export default StudentDetailPage;
