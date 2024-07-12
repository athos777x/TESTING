import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleSearchFilter from '../Utilities/ScheduleSearchFilter';
import '../CssPage/SchedulePage.css';
import '../CssFiles/searchfilter.css';

function SchedulePage() {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    grade: '',
    section: ''
  });

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async (appliedFilters = {}) => {
    try {
      const response = await axios.get('http://localhost:3001/schedule', {
        params: appliedFilters
      });
      setScheduleData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('There was an error fetching the schedule data!', error);
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [type]: value }));
  };

  const applyFilters = () => {
    let filtered = scheduleData;

    if (filters.grade) {
      filtered = filtered.filter(item => item.grade_level === filters.grade);
    }
    if (filters.section) {
      filtered = filtered.filter(item => item.section_id === parseInt(filters.section));
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(item =>
        item.subject_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.teacher_name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    applyFilters();
  };

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Schedule</h1>
      <div className="schedule-search-filter-container">
        <ScheduleSearchFilter
          handleApplyFilters={handleApplyFilters}
          grades={['7', '8', '9', '10']}
          sections={scheduleData}
        />
      </div>
      <div className="schedule-list">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={index} className="schedule-item">
              <p>{item.subject_name} - {item.teacher_name}</p>
              <p>Grade: {item.grade_level}, Section: {item.section_name}</p>
              <p>Time: {item.time}</p>
            </div>
          ))
        ) : (
          <p>No schedules available.</p>
        )}
      </div>
    </div>
  );
}

export default SchedulePage;
