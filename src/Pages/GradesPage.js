import React, { useState, useEffect } from 'react';
import SearchFilter from '../Utilities/SearchFilter';
import axios from 'axios';
import '../CssPage/GradesPage.css';

function GradesPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [grades, setGrades] = useState([]);

  const [filters, setFilters] = useState({
    searchTerm: '',
    grade: '',
    section: '',
    school_year: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3001/students')
      .then(response => {
        const sortedStudents = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(sortedStudents);
        setFilteredStudents(sortedStudents);
      })
      .catch(error => {
        console.error('There was an error fetching the students!', error);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    setFilters(prevFilters => ({ ...prevFilters, searchTerm }));
  };

  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [type]: value }));
  };

  const handleApplyFilters = () => {
    let filtered = students;

    if (filters.grade) {
      filtered = filtered.filter(student => student.grade_level === filters.grade);
    }
    if (filters.section) {
      filtered = filtered.filter(student => student.section === filters.section);
    }
    if (filters.school_year) {
      filtered = filtered.filter(student => student.school_year === filters.school_year);
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleStudentClick = (studentId, gradeLevel) => {
    if (selectedStudentId === studentId) {
      setSelectedStudentId(null);
      setGrades([]);
    } else {
      setSelectedStudentId(studentId);
      fetchStudentGrades(studentId, gradeLevel);
    }
  };

  const fetchStudentGrades = (studentId, gradeLevel) => {
    axios.get(`http://localhost:3001/students/${studentId}/grades`)
      .then(response => {
        setGrades(response.data.filter(grade => grade.grade_level === gradeLevel));
      })
      .catch(error => {
        console.error('There was an error fetching the grades!', error);
      });
  };

  return (
    <div className="grades-container">
      <h1 className="grades-title">Grades</h1>
      <div className="search-filter-container">
        <SearchFilter
          handleSearch={handleSearch}
          handleFilter={handleFilterChange}
          handleApplyFilters={handleApplyFilters}
        />
      </div>
      <div>
        {filteredStudents.map((student, index) => (
          <div key={student.student_id} className="student-item" onClick={() => handleStudentClick(student.student_id, student.grade_level)}>
            <p>{index + 1}. {student.name}</p>
            {selectedStudentId === student.student_id && (
              <div className="grades-details">
                <h2>Grades</h2>
                <table>
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
                    {grades.map((grade, index) => (
                      <tr key={index}>
                        <td>{grade.subject_name}</td>
                        <td>{grade.q1_grade}</td>
                        <td>{grade.q2_grade}</td>
                        <td>{grade.q3_grade}</td>
                        <td>{grade.q4_grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GradesPage;
