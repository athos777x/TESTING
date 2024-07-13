// SubjectsSearchFilter.js
import React, { useState, useEffect } from 'react';
import '../CssFiles/searchfilter.css';
import axios from 'axios';

function SubjectsSearchFilter({ handleSearch, handleFilter, handleApplyFilters }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [schoolYears, setSchoolYears] = useState([]);
  const [grades, setGrades] = useState(['7', '8', '9', '10']); // Example grades

  useEffect(() => {
    // Fetch school years or any necessary data here if needed
    axios.get('http://localhost:3001/api/school_years')
      .then(response => {
        setSchoolYears(response.data.map(sy => sy.school_year));
      })
      .catch(error => {
        console.error('There was an error fetching the school years!', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleSchoolYearChange = (event) => {
    const value = event.target.value;
    setSelectedSchoolYear(value);
    handleFilter('school_year', value);
  };

  const handleGradeChange = (event) => {
    const value = event.target.value;
    setSelectedGrade(value);
    handleFilter('grade', value);
  };

  const applyFilters = () => {
    const filters = {
      searchTerm,
      school_year: selectedSchoolYear,
      grade: selectedGrade
    };
    handleApplyFilters(filters);
  };

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search by subject name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="filter-input"
      />
      <select id="school_year" value={selectedSchoolYear} onChange={handleSchoolYearChange} className="filter-select">
        <option value="">Select School Year</option>
        {schoolYears.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))}
      </select>
      <select id="grade" value={selectedGrade} onChange={handleGradeChange} className="filter-select">
        <option value="">Select Grade</option>
        {grades.map((grade, index) => (
          <option key={index} value={grade}>{grade}</option>
        ))}
      </select>
      <button onClick={applyFilters} className="filter-button">Apply Filters</button>
    </div>
  );
}

export default SubjectsSearchFilter;
