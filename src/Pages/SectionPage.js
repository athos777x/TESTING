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
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

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
      setIsEditing(false);
    } else {
      setSelectedSectionId(sectionId);
      setIsEditing(false);
      fetchSectionDetails(sectionId);
    }
  };

  const fetchSectionDetails = async (sectionId) => {
    try {
      const response = await axios.get(`http://localhost:3001/sections/${sectionId}`);
      setSectionDetails(response.data);
      setEditFormData(response.data);
    } catch (error) {
      console.error('There was an error fetching the section details!', error);
    }
  };

  const startEditing = (sectionId) => {
    setSelectedSectionId(sectionId);
    setIsEditing(true);
    const section = sections.find(sec => sec.section_id === sectionId);
    setEditFormData(section);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const saveChanges = async () => {
    try {
      const { school_year, ...updateData } = editFormData; // Exclude the school_year field
      await axios.put(`http://localhost:3001/sections/${selectedSectionId}`, updateData);
      fetchSections(activeSchoolYear);  // Refresh the section list after saving
      fetchSectionDetails(selectedSectionId); // Fetch the updated section details
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving section details:', error);
    }
  };

  const toggleArchiveStatus = async (sectionId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
      await axios.put(`http://localhost:3001/sections/${sectionId}/status`, { status: newStatus });
      fetchSections(activeSchoolYear);  // Refresh the section list after changing archive status
    } catch (error) {
      console.error(`Error changing status:`, error);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    fetchSectionDetails(selectedSectionId);
  };

  const capitalizeStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
              <span className="section-info">Grade: {section.grade_level} - {capitalizeStatus(section.status)}</span>
              <div className="section-actions">
                <button className="section-view-button" onClick={() => handleViewClick(section.section_id)}>View</button>
                <button className="section-edit-button" onClick={() => startEditing(section.section_id)}>Edit</button>
                <button
                  className="section-archive-button"
                  onClick={() => toggleArchiveStatus(section.section_id, section.status)}
                >
                  {section.status === 'inactive' ? 'Activate' : 'Archive'}
                </button>
              </div>
            </div>
            {selectedSectionId === section.section_id && (
              <div className="section-details">
                <table>
                  <tbody>
                    <tr>
                      <th>Section ID:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="section_id"
                            value={editFormData.section_id}
                            onChange={handleEditChange}
                            readOnly
                          />
                        ) : (
                          sectionDetails.section_id
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Section Name:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="section_name"
                            value={editFormData.section_name}
                            onChange={handleEditChange}
                          />
                        ) : (
                          sectionDetails.section_name
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Grade Level:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="grade_level"
                            value={editFormData.grade_level}
                            onChange={handleEditChange}
                          />
                        ) : (
                          sectionDetails.grade_level
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Status:</th>
                      <td>
                        {isEditing ? (
                          <select
                            name="status"
                            value={editFormData.status}
                            onChange={handleEditChange}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          capitalizeStatus(sectionDetails.status)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Max Capacity:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="max_capacity"
                            value={editFormData.max_capacity}
                            onChange={handleEditChange}
                          />
                        ) : (
                          sectionDetails.max_capacity
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>School Year:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="school_year"
                            value={editFormData.school_year}
                            onChange={handleEditChange}
                            readOnly
                          />
                        ) : (
                          sectionDetails.school_year
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {isEditing && (
                  <div className="section-edit-buttons">
                    <button className="section-save-button" onClick={saveChanges}>Save</button>
                    <button className="section-cancel-button" onClick={cancelEditing}>Cancel</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SectionPage;
