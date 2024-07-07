import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SchoolYearSearchFilter from '../Utilities/SchoolYearSearchFilter';
import '../CssPage/SchoolYearPage.css';

function SchoolYearPage() {
  const [schoolYears, setSchoolYears] = useState([]);
  const [filteredSchoolYears, setFilteredSchoolYears] = useState([]);
  const [selectedSchoolYearId, setSelectedSchoolYearId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [filters, setFilters] = useState({
    searchTerm: '',
    school_year: ''
  });

  const fetchSchoolYears = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/school-years', {
        params: filters
      });
      const sortedSchoolYears = response.data.sort((a, b) => a.school_year.localeCompare(b.school_year));
      setSchoolYears(sortedSchoolYears);
      setFilteredSchoolYears(sortedSchoolYears);
    } catch (error) {
      console.error('Error fetching school years:', error);
    }
  }, [filters]);

  useEffect(() => {
    fetchSchoolYears();
  }, [fetchSchoolYears]);

  const handleSearch = (searchTerm) => {
    setFilters(prevFilters => ({ ...prevFilters, searchTerm }));
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleSchoolYearDetails = (schoolYearId) => {
    if (selectedSchoolYearId === schoolYearId) {
      setSelectedSchoolYearId(null);
      setIsEditing(false);
    } else {
      setSelectedSchoolYearId(schoolYearId);
      setIsEditing(false);
      const schoolYear = schoolYears.find(sy => sy.school_year_id === schoolYearId);
      setEditFormData({
        ...schoolYear,
        school_year_start: formatDateForInput(schoolYear.school_year_start),
        school_year_end: formatDateForInput(schoolYear.school_year_end),
        enrollment_start: formatDateForInput(schoolYear.enrollment_start),
        enrollment_end: formatDateForInput(schoolYear.enrollment_end),
      });
    }
  };

  const startEditing = (schoolYearId) => {
    setSelectedSchoolYearId(schoolYearId);
    setIsEditing(true);
    const schoolYear = schoolYears.find(sy => sy.school_year_id === schoolYearId);
    setEditFormData({
      ...schoolYear,
      school_year_start: formatDateForInput(schoolYear.school_year_start),
      school_year_end: formatDateForInput(schoolYear.school_year_end),
      enrollment_start: formatDateForInput(schoolYear.enrollment_start),
      enrollment_end: formatDateForInput(schoolYear.enrollment_end),
    });
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
      const updatedData = {
        ...editFormData,
        school_year_start: formatDateForBackend(editFormData.school_year_start),
        school_year_end: formatDateForBackend(editFormData.school_year_end),
        enrollment_start: formatDateForBackend(editFormData.enrollment_start),
        enrollment_end: formatDateForBackend(editFormData.enrollment_end)
      };
      await axios.put(`http://localhost:3001/school-years/${selectedSchoolYearId}`, updatedData);
      fetchSchoolYears();  // Refresh the school year list after saving
      setIsEditing(false);  // Set editing state to false
      setSelectedSchoolYearId(null); // Deselect the current school year
    } catch (error) {
      console.error('Error saving school year details:', error);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    const schoolYear = schoolYears.find(sy => sy.school_year_id === selectedSchoolYearId);
    setEditFormData({
      ...schoolYear,
      school_year_start: formatDateForInput(schoolYear.school_year_start),
      school_year_end: formatDateForInput(schoolYear.school_year_end),
      enrollment_start: formatDateForInput(schoolYear.enrollment_start),
      enrollment_end: formatDateForInput(schoolYear.enrollment_end),
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  return (
    <div className="school-year-container">
      <h1 className="school-year-title">School Year Management</h1>
      <div className="school-year-search-filter-container">
        <SchoolYearSearchFilter
          handleSearch={handleSearch}
          handleApplyFilters={handleApplyFilters}
        />
      </div>
      <div className="school-year-list">
        {filteredSchoolYears.map((schoolYear, index) => (
          <div key={schoolYear.school_year_id} className="school-year-item-container">
            <div className="school-year-item">
              <p className="school-year-name">
                {index + 1}. {schoolYear.school_year}
              </p>
              <span className="school-year-info">{schoolYear.status}</span>
              <div className="school-year-actions">
                <button className="school-year-view-button" onClick={() => toggleSchoolYearDetails(schoolYear.school_year_id)}>View</button>
                <button className="school-year-edit-button" onClick={() => startEditing(schoolYear.school_year_id)}>Edit</button>
              </div>
            </div>
            {selectedSchoolYearId === schoolYear.school_year_id && (
              <div className="school-year-details">
                <table>
                  <tbody>
                    <tr>
                      <th>Year:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="school_year"
                            value={editFormData.school_year}
                            onChange={handleEditChange}
                          />
                        ) : (
                          schoolYear.school_year
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
                          schoolYear.status
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Start Date:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="date"
                            name="school_year_start"
                            value={editFormData.school_year_start}
                            onChange={handleEditChange}
                          />
                        ) : (
                          formatDate(schoolYear.school_year_start)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>End Date:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="date"
                            name="school_year_end"
                            value={editFormData.school_year_end}
                            onChange={handleEditChange}
                          />
                        ) : (
                          formatDate(schoolYear.school_year_end)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Enrollment Start:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="date"
                            name="enrollment_start"
                            value={editFormData.enrollment_start}
                            onChange={handleEditChange}
                          />
                        ) : (
                          formatDate(schoolYear.enrollment_start)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Enrollment End:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="date"
                            name="enrollment_end"
                            value={editFormData.enrollment_end}
                            onChange={handleEditChange}
                          />
                        ) : (
                          formatDate(schoolYear.enrollment_end)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {isEditing && (
                  <div className="school-year-edit-buttons">
                    <button className="school-year-save-button" onClick={saveChanges}>Save</button>
                    <button className="school-year-cancel-button" onClick={cancelEditing}>Cancel</button>
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

export default SchoolYearPage;
