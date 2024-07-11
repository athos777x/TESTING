// ScheduleSearchFilter.js
import React, { useState, useEffect } from 'react';
import '../CssFiles/searchfilter.css';
import axios from 'axios';

function ScheduleSearchFilter({ handleSearch, handleFilter, handleApplyFilters }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sections, setSections] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/sections')
      .then(response => {
        setSections(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the sections!', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const applyFilters = () => {
    const filters = {
      searchTerm,
      date: selectedDate,
    };
    handleApplyFilters(filters);
  };

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search by section name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="filter-input"
      />
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="filter-input"
      />
      <button onClick={applyFilters} className="filter-button">Apply Filters</button>
    </div>
  );
}

export default ScheduleSearchFilter;
