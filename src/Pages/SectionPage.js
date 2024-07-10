// SectionPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SectionSearchFilter from '../Utilities/SectionSearchFilter'; // Ensure correct path
import '../CssPage/SectionPage.css';

function SectionPage() {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [sectionDetails, setSectionDetails] = useState({});
  const [activeSchoolYear, setActiveSchoolYear] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    grade: '',
    section: ''
  });

  const fetchActiveSchoolYear = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/school-years/active');
      setActiveSchoolYear(response.data.school_year_id);
      return response.data;
    } catch (error) {
      console.error('There was an error fetching the active school year!', error);
      return null;
    }
  }, []);

  const fetchSections = useCallback(async (schoolYearId) => {
    try {
      const response = await axios.get('http://localhost:3001/sections', {
        params: { schoolYearId }
      });
      setSections(response.data);
      setFilteredSections(response.data);
    } catch (error) {
      console.error('There was an error fetching the sections!', error);
    }
  }, []);

  const getUniqueGrades = (sections) => {
    const grades = sections.map(section => section.grade_level);
    return [...new Set(grades)];
  };

  useEffect(() => {
    async function loadSections() {
      const activeYear = await fetchActiveSchoolYear();
      if (activeYear) {
        fetchSections(activeYear.school_year_id);
      }
    }
    loadSections();
  }, [fetchActiveSchoolYear, fetchSections]);

  const applyFilters = (updatedFilters) => {
    console.log('Updated filters:', updatedFilters);
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

    console.log('Filtered sections:', filtered);
    setFilteredSections(filtered);
  };

  const handleApplyFilters = (filters) => {
    setFilters(filters);
    applyFilters(filters);
  };

  const handleViewClick = async (sectionId) => {
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
      setSectionDetails({});
    } else {
      setSelectedSectionId(sectionId);
      fetchSectionDetails(sectionId);
    }
  };

  const fetchSectionDetails = async (sectionId) => {
    try {
      const response = await axios.get(`http://localhost:3001/sections/${sectionId}`);
      setSectionDetails(response.data);
    } catch (error) {
      console.error('There was an error fetching the section details!', error);
    }
  };

  return (
    <div className="section-container">
      <h1 className="section-title">Section Management</h1>
      <div className="section-search-filter-container">
        <SectionSearchFilter
          handleApplyFilters={handleApplyFilters}
          grades={getUniqueGrades(sections)}
          sections={sections}
        />
      </div>
      <div className="section-list">
        {filteredSections.map((section, index) => (
          <div key={section.section_id} className="section-item-container">
            <div className="section-item">
              <p className="section-name">
                {index + 1}. Section {section.section_name}
              </p>
              <span className="section-info">Grade: {section.grade_level} - {section.status.charAt(0).toUpperCase() + section.status.slice(1)}</span>
              <div className="section-actions">
                <button className="section-view-button" onClick={() => handleViewClick(section.section_id)}>View</button>
              </div>
            </div>
            {selectedSectionId === section.section_id && sectionDetails.section_id && (
              <div className="section-details">
                <table>
                  <tbody>
                    <tr>
                      <th>Section ID:</th>
                      <td>{sectionDetails.section_id}</td>
                    </tr>
                    <tr>
                      <th>Section Name:</th>
                      <td>{sectionDetails.section_name}</td>
                    </tr>
                    <tr>
                      <th>Grade Level:</th>
                      <td>{sectionDetails.grade_level}</td>
                    </tr>
                    <tr>
                      <th>Status:</th>
                      <td>{sectionDetails.status}</td>
                    </tr>
                    <tr>
                      <th>Max Capacity:</th>
                      <td>{sectionDetails.max_capacity}</td>
                    </tr>
                    <tr>
                      <th>School Year:</th>
                      <td>{sectionDetails.school_year}</td>
                    </tr>
                    {/* Add other details as needed */}
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

export default SectionPage;
