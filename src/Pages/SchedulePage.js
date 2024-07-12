import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ScheduleSearchFilter from '../Utilities/ScheduleSearchFilter';
import '../CssPage/SchedulePage.css';

function SchedulePage() {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [sectionSchedules, setSectionSchedules] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    grade: '',
    section: ''
  });

  const fetchSections = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/sections');
      setSections(response.data);
      setFilteredSections(response.data);
    } catch (error) {
      console.error('There was an error fetching the sections!', error);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const applyFilters = (updatedFilters) => {
    setFilters(updatedFilters);
    let filtered = sections;

    if (updatedFilters.searchTerm) {
      filtered = filtered.filter(section =>
        section.section_name.toLowerCase().includes(updatedFilters.searchTerm.toLowerCase())
      );
    }

    if (updatedFilters.grade) {
      filtered = filtered.filter(section => section.grade_level === updatedFilters.grade);
    }

    if (updatedFilters.section) {
      filtered = filtered.filter(section => section.section_id === parseInt(updatedFilters.section));
    }

    setFilteredSections(filtered);
  };

  const handleApplyFilters = (filters) => {
    applyFilters(filters);
  };

  const handleViewClick = async (sectionId) => {
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
      setSectionSchedules([]);
    } else {
      setSelectedSectionId(sectionId);
      setSectionSchedules([]); // Clear previous schedules
      fetchSectionSchedules(sectionId);
    }
  };

  const fetchSectionSchedules = async (sectionId) => {
    try {
      const response = await axios.get(`http://localhost:3001/sections/${sectionId}/schedules`);
      setSectionSchedules(response.data);
    } catch (error) {
      console.error('There was an error fetching the section schedules!', error);
    }
  };

  const handleApproveClick = async (sectionId) => {
    try {
      await axios.put(`http://localhost:3001/sections/${sectionId}/approve`);
      fetchSections(); // Refresh the sections list
    } catch (error) {
      console.error('There was an error approving the section!', error);
    }
  };

  const handleEditClick = (sectionId) => {
    // Implement the edit functionality here
    console.log(`Edit section ${sectionId}`);
  };

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Schedule</h1>
      <div className="schedule-search-filter-container">
        <ScheduleSearchFilter
          handleApplyFilters={handleApplyFilters}
          grades={['7', '8', '9', '10']}
          sections={sections}
        />
      </div>
      <div className="sectionlist-list">
        {filteredSections.length > 0 ? (
          filteredSections.map((section, index) => (
            <div key={section.section_id} className="sectionlist-item-container">
              <div className="sectionlist-item">
                <p className="sectionlist-name">
                  {index + 1}. Section {section.section_name}
                </p>
                <span className="sectionlist-info">Grade: {section.grade_level} - {section.status.charAt(0).toUpperCase() + section.status.slice(1)}</span>
                <div className="sectionlist-actions">
                  <button className="sectionlist-view-button" onClick={() => handleViewClick(section.section_id)}>View</button>
                  <button className="sectionlist-edit-button" onClick={() => handleEditClick(section.section_id)}>Edit</button>
                  <button className="sectionlist-approve-button" onClick={() => handleApproveClick(section.section_id)}>Approve</button>
                </div>
              </div>
              {selectedSectionId === section.section_id && (
                <div className="sectionlist-details">
                  <h2 className="schedule-subtitle">Schedules</h2>
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Time Start</th>
                        <th>Time End</th>
                        <th>Day</th>
                        <th>Teacher ID</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectionSchedules.length > 0 ? (
                        sectionSchedules.map(schedule => (
                          <tr key={schedule.schedule_id}>
                            <td>{schedule.subject_name}</td>
                            <td>{schedule.time_start}</td>
                            <td>{schedule.time_end}</td>
                            <td>{schedule.day}</td>
                            <td>{schedule.teacher_id}</td>
                            <td>{schedule.schedule_status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center' }}>No schedules available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No sections available.</p>
        )}
      </div>
    </div>
  );
}

export default SchedulePage;
