import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilter from '../Utilities/SearchFilter';
import axios from 'axios';
import '../CssPage/StudentsPage.css'; // Ensure this import is correct

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    school_year: '',
    grade: '',
    section: '',
    status: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/students')
      .then(response => {
        const sortedStudents = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(sortedStudents);
        setFilteredStudents(sortedStudents);
        console.log('Fetched students:', sortedStudents); // Add this line
      })
      .catch(error => {
        console.error('There was an error fetching the students!', error);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, searchTerm };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, [type]: value };
      return updatedFilters;
    });
  };

  const applyFilters = (updatedFilters) => {
    let filtered = students;

    if (updatedFilters.school_year) {
      filtered = filtered.filter(student => String(student.school_year) === updatedFilters.school_year);
    }
    if (updatedFilters.grade) {
      filtered = filtered.filter(student => student.grade_level === updatedFilters.grade);
    }
    if (updatedFilters.section) {
      filtered = filtered.filter(student => student.section === updatedFilters.section);
    }
    if (updatedFilters.status) {
      filtered = filtered.filter(student => student.status === updatedFilters.status);
    }
    if (updatedFilters.searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(updatedFilters.searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
    console.log('Filtered students:', filtered);
  };

  const handleApplyFilters = () => {
    applyFilters(filters);
  };

  const handleViewButtonClick = (studentId) => {
    navigate(`/students/${studentId}/details`);
  };

  return (
    <div className="students-container">
      <h1 className="students-title">Students</h1>
      <div className="search-filter-container">
        <SearchFilter
          handleSearch={handleSearch}
          handleFilter={handleFilterChange}
          handleApplyFilters={handleApplyFilters}
        />
      </div>
      <div className="students-list">
        {filteredStudents.map((student, index) => (
          <div key={student.student_id} className="student-item-container">
            <div className="student-item">
              <p onClick={() => setSelectedStudentId(selectedStudentId === student.student_id ? null : student.student_id)}>
                {index + 1}. {student.name} (Grade {student.grade_level}) - {student.status}
              </p>
              <button className="view-button" onClick={() => handleViewButtonClick(student.student_id)}>
                View
              </button>
            </div>
            {selectedStudentId === student.student_id && (
              <div className="student-details">
                <table>
                  <tbody>
                    <tr>
                      <td><strong>Address:</strong></td>
                      <td>{student.address}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone Number:</strong></td>
                      <td>{student.phone_number}</td>
                    </tr>
                    <tr>
                      <td><strong>School Year:</strong></td>
                      <td>{student.school_year}</td>
                    </tr>
                    <tr>
                      <td><strong>Grade:</strong></td>
                      <td>Grade {student.grade_level}</td>
                    </tr>
                    <tr>
                      <td><strong>Section:</strong></td>
                      <td>{student.section}</td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>{student.status}</td>
                    </tr>
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

export default StudentsPage;
