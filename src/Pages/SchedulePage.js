// SchedulePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleSearchFilter from '../Utilities/ScheduleSearchFilter';
import '../CssPage/SchedulePage.css';

function SchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async (filters = {}) => {
    try {
      const response = await axios.get('http://localhost:3001/schedules', { params: filters });
      setSchedules(response.data);
      setFilteredSchedules(response.data);
    } catch (error) {
      console.error('There was an error fetching the schedules!', error);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = schedules.filter(schedule =>
      schedule.section_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchedules(filtered);
  };

  const handleFilter = (type, value) => {
    // Add filter handling logic if needed
  };

  const handleApplyFilters = (filters) => {
    fetchSchedules(filters);
  };

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Schedule</h1>
      <div className="schedule-search-filter-container">
        <ScheduleSearchFilter
          handleSearch={handleSearch}
          handleFilter={handleFilter}
          handleApplyFilters={handleApplyFilters}
        />
      </div>
      <div className="schedule-list">
        {filteredSchedules.map((schedule, index) => (
          <div key={index} className="schedule-item">
            <p>Section: {schedule.section_name}</p>
            <p>Date: {schedule.date}</p>
            <p>Time: {schedule.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchedulePage;
