import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilter from '../Utilities/SearchFilter';
import axios from 'axios';
import '../CssPage/StudentsPage.css';

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
        const sortedStudents = response.data.sort((a, b) => a.lastname.localeCompare(b.lastname));
        setStudents(sortedStudents);
        setFilteredStudents(sortedStudents);
        console.log('Fetched students:', sortedStudents);
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
      filtered = filtered.filter(student => student.current_yr_lvl === updatedFilters.grade);
    }
    if (updatedFilters.section) {
      filtered = filtered.filter(student => student.section === updatedFilters.section);
    }
    if (updatedFilters.status) {
      filtered = filtered.filter(student => student.student_status === updatedFilters.status);
    }
    if (updatedFilters.searchTerm) {
      filtered = filtered.filter(student =>
        student.lastname.toLowerCase().includes(updatedFilters.searchTerm.toLowerCase()) ||
        student.firstname.toLowerCase().includes(updatedFilters.searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
    console.log('Filtered students:', filtered);
  };

  const handleApplyFilters = () => {
    applyFilters(filters);
  };

  const toggleStudentDetails = (studentId) => {
    setSelectedStudentId(selectedStudentId === studentId ? null : studentId);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
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
          <div key={student.student_id} className="student-item-container" onClick={() => toggleStudentDetails(student.student_id)}>
            <div className="student-item">
              <p className="student-name">
                {index + 1}. {student.firstname} {student.middlename && `${student.middlename[0]}.`} {student.lastname}
              </p>
              <span className="student-info">Grade {student.current_yr_lvl} - {student.student_status}</span>
              <button className="view-button" onClick={() => navigate(`/students/${student.student_id}/details`)}>View</button>
            </div>
            {selectedStudentId === student.student_id && (
              <div className="student-details">
                <table>
                  <tbody>
                    <tr>
                      <td><strong>Last Name:</strong></td>
                      <td>{student.lastname}</td>
                    </tr>
                    <tr>
                      <td><strong>First Name:</strong></td>
                      <td>{student.firstname}</td>
                    </tr>
                    <tr>
                      <td><strong>Middle Name:</strong></td>
                      <td>{student.middlename}</td>
                    </tr>
                    <tr>
                      <td><strong>Current Year Level:</strong></td>
                      <td>{student.current_yr_lvl}</td>
                    </tr>
                    <tr>
                      <td><strong>Birthdate:</strong></td>
                      <td>{formatDate(student.birthdate)}</td>
                    </tr>
                    <tr>
                      <td><strong>Gender:</strong></td>
                      <td>{student.gender}</td>
                    </tr>
                    <tr>
                      <td><strong>Age:</strong></td>
                      <td>{student.age}</td>
                    </tr>
                    <tr>
                      <td><strong>Home Address:</strong></td>
                      <td>{student.home_address}</td>
                    </tr>
                    <tr>
                      <td><strong>Barangay:</strong></td>
                      <td>{student.barangay}</td>
                    </tr>
                    <tr>
                      <td><strong>City/Municipality:</strong></td>
                      <td>{student.city_municipality}</td>
                    </tr>
                    <tr>
                      <td><strong>Province:</strong></td>
                      <td>{student.province}</td>
                    </tr>
                    <tr>
                      <td><strong>Contact Number:</strong></td>
                      <td>{student.contact_number}</td>
                    </tr>
                    <tr>
                      <td><strong>Email Address:</strong></td>
                      <td>{student.email_address}</td>
                    </tr>
                    <tr>
                      <td><strong>Mother's Name:</strong></td>
                      <td>{student.mother_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Father's Name:</strong></td>
                      <td>{student.father_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Parent Address:</strong></td>
                      <td>{student.parent_address}</td>
                    </tr>
                    <tr>
                      <td><strong>Father's Occupation:</strong></td>
                      <td>{student.father_occupation}</td>
                    </tr>
                    <tr>
                      <td><strong>Mother's Occupation:</strong></td>
                      <td>{student.mother_occupation}</td>
                    </tr>
                    <tr>
                      <td><strong>Annual Household Income:</strong></td>
                      <td>{student.annual_hshld_income}</td>
                    </tr>
                    <tr>
                      <td><strong>Number of Siblings:</strong></td>
                      <td>{student.number_of_siblings}</td>
                    </tr>
                    <tr>
                      <td><strong>Father's Education Level:</strong></td>
                      <td>{student.father_educ_lvl}</td>
                    </tr>
                    <tr>
                      <td><strong>Mother's Education Level:</strong></td>
                      <td>{student.mother_educ_lvl}</td>
                    </tr>
                    <tr>
                      <td><strong>Father's Contact Number:</strong></td>
                      <td>{student.father_contact_number}</td>
                    </tr>
                    <tr>
                      <td><strong>Mother's Contact Number:</strong></td>
                      <td>{student.mother_contact_number}</td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>{student.student_status}</td>
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
