import React, { useState, useEffect } from 'react';
import '../CssFiles/searchfilter.css';
import axios from 'axios';

// Search and Filter Component
function SearchFilter({ handleSearch, handleFilter, handleApplyFilters }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const [schoolYears, setSchoolYears] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Fetch school years, grades, and sections from the server
    axios.get('http://localhost:3001/filters')
      .then(response => {
        console.log(response.data); // Verify the received data
        setSchoolYears(response.data.schoolYears);
        setGrades(response.data.grades);
        setSections(response.data.sections);
      })
      .catch(error => {
        console.error('There was an error fetching the filter options!', error);
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

  const handleSectionChange = (event) => {
    const value = event.target.value;
    setSelectedSection(value);
    handleFilter('section', value);
  };

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="filter-input"
      />
      <select id="schoolYear" value={selectedSchoolYear} onChange={handleSchoolYearChange} className="filter-select">
        <option value="">Select School Year</option>
        {schoolYears.map(schoolYear => (
          <option key={schoolYear.school_year_id} value={schoolYear.year}>{schoolYear.year}</option>
        ))}
      </select>
      <select id="grade" value={selectedGrade} onChange={handleGradeChange} className="filter-select">
        <option value="">Select Grade</option>
        {grades.map(grade => (
          <option key={grade} value={grade}>{grade}</option>
        ))}
      </select>
      <select id="section" value={selectedSection} onChange={handleSectionChange} className="filter-select">
        <option value="">Select Section</option>
        {sections.map(section => (
          <option key={section} value={section}>{section}</option>
        ))}
      </select>
      <button onClick={handleApplyFilters} className="filter-button">Apply Filters</button>
    </div>
  );
}

export default SearchFilter;
