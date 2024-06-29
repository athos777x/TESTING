import React, { useState, useEffect } from 'react';
import SearchFilter from '../Utilities/SearchFilter';
import axios from 'axios';
import '../CssPage/AttendancePage.css';

function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [filters, setFilters] = useState({
    searchTerm: '',
    grade: '',
    section: '',
    school_year: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/students');
      const sortedStudents = response.data.sort((a, b) => a.lastname.localeCompare(b.lastname));
      setStudents(sortedStudents);
      setFilteredStudents(sortedStudents);
      console.log('Students fetched:', sortedStudents);
    } catch (error) {
      console.error('There was an error fetching the students!', error);
    }
  };

  const fetchAttendanceData = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:3001/attendance/${studentId}`);
      console.log('Attendance data fetched for student', studentId, response.data);
      setAttendanceData(prevData => ({
        ...prevData,
        [studentId]: response.data
      }));
    } catch (error) {
      console.error('There was an error fetching the attendance data!', error);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prevFilters => ({ ...prevFilters, searchTerm }));
  };

  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [type]: value }));
  };

  const handleApplyFilters = () => {
    let filtered = students;

    if (filters.grade) {
      filtered = filtered.filter(student => student.current_yr_lvl === filters.grade);
    }
    if (filters.section) {
      filtered = filtered.filter(student => student.section_id === parseInt(filters.section));
    }
    if (filters.school_year) {
      filtered = filtered.filter(student => student.school_year === filters.school_year);
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(student =>
        `${student.firstname} ${student.lastname}`.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleStudentClick = async (studentId) => {
    console.log('Student clicked:', studentId);
    if (!attendanceData[studentId]) {
      await fetchAttendanceData(studentId);
    }
    setSelectedStudentId(selectedStudentId === studentId ? null : studentId);
  };

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Attendance</h1>
      <div className="attendance-search-filter-container">
        <SearchFilter
          handleSearch={handleSearch}
          handleFilter={handleFilterChange}
          handleApplyFilters={handleApplyFilters}
        />
      </div>
      <ul className="attendance-list">
        {filteredStudents.map((student, index) => (
          <li key={student.student_id} className="attendance-student-item-container" onClick={() => handleStudentClick(student.student_id)}>
            <div className="attendance-student-item">
              <p className="attendance-student-name">{index + 1}. {student.firstname} {student.middlename} {student.lastname}</p>
              <p className="attendance-student-info">Grade {student.current_yr_lvl} - {student.student_status}</p>
              <button className="attendance-view-button">View</button>
            </div>
            {selectedStudentId === student.student_id && attendanceData[student.student_id] && (
              <div className="attendance-student-details">
                <table className="attendance-table">
                  <tbody>
                    <tr>
                      <th>Total School Days</th>
                      <td>{attendanceData[student.student_id].total_school_days}</td>
                    </tr>
                    <tr>
                      <th>Total Days Present</th>
                      <td>{attendanceData[student.student_id].days_present}</td>
                    </tr>
                    <tr>
                      <th>Total Days Absent</th>
                      <td>{attendanceData[student.student_id].days_absent}</td>
                    </tr>
                    <tr>
                      <th>Total Days Late</th>
                      <td>{attendanceData[student.student_id].days_late}</td>
                    </tr>
                    <tr>
                      <th>Brigada Attendance</th>
                      <td>{attendanceData[student.student_id].brigada_attendance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttendancePage;
