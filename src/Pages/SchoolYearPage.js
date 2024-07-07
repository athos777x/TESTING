import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchFilter from '../Utilities/SearchFilter';
import '../CssPage/SchoolYearPage.css';

function SchoolYearPage() {
  const [schoolYears, setSchoolYears] = useState([]);
  const [filteredSchoolYears, setFilteredSchoolYears] = useState([]);
  const [selectedSchoolYearId, setSelectedSchoolYearId] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: ''
  });

  useEffect(() => {
    fetchSchoolYears();
  }, [filters]);

  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get('http://localhost:3001/school-years', {
        params: filters
      });
      console.log('School years fetched:', response.data); // Log fetched data
      const sortedSchoolYears = response.data.sort((a, b) => a.school_year.localeCompare(b.school_year));
      setSchoolYears(sortedSchoolYears);
      setFilteredSchoolYears(sortedSchoolYears);
    } catch (error) {
      console.error('Error fetching school years:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prevFilters => ({ ...prevFilters, searchTerm }));
  };

  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [type]: value }));
  };

  const applyFilters = () => {
    fetchSchoolYears();
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleSchoolYearDetails = (schoolYearId) => {
    setSelectedSchoolYearId(selectedSchoolYearId === schoolYearId ? null : schoolYearId);
  };

  return (
    <div className="school-year-container">
      <h1 className="school-year-title">School Year Management</h1>
      <div className="school-year-search-filter-container">
        <SearchFilter
          handleSearch={handleSearch}
          handleFilter={handleFilterChange}
          handleApplyFilters={handleApplyFilters}
        />
      </div>
      <div className="school-year-list">
        {filteredSchoolYears.map((schoolYear, index) => (
          <div key={schoolYear.school_year_id} className="school-year-item-container" onClick={() => toggleSchoolYearDetails(schoolYear.school_year_id)}>
            <div className="school-year-item">
              <p className="school-year-name">
                {index + 1}. {schoolYear.school_year}
              </p>
              <span className="school-year-info">{schoolYear.status}</span>
              <button className="school-year-view-button">View</button>
            </div>
            {selectedSchoolYearId === schoolYear.school_year_id && (
              <div className="school-year-details">
                <table>
                  <tbody>
                    <tr>
                      <th>Year:</th>
                      <td>{schoolYear.school_year}</td>
                    </tr>
                    <tr>
                      <th>Status:</th>
                      <td>{schoolYear.status}</td>
                    </tr>
                    <tr>
                      <th>Start Date:</th>
                      <td>{schoolYear.school_year_start}</td>
                    </tr>
                    <tr>
                      <th>End Date:</th>
                      <td>{schoolYear.school_year_end}</td>
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

export default SchoolYearPage;
