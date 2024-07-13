// SubjectsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SubjectsSearchFilter from '../Utilities/SubjectsSearchFilter';
import '../CssPage/SubjectsPage.css';

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [filters, setFilters] = useState({
    searchTerm: '',
    school_year: '',
    grade: ''
  });
  const [grades] = useState(['7', '8', '9', '10']); // Example grades
  const [schoolYears, setSchoolYears] = useState([]);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/subjects', {
        params: filters
      });
      setSubjects(response.data);
      setFilteredSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, [filters]);

  const fetchSchoolYears = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/school_years');
      setSchoolYears(response.data.map(sy => sy.school_year));
    } catch (error) {
      console.error('Error fetching school years:', error);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
    fetchSchoolYears();
  }, [fetchSubjects, fetchSchoolYears]);

  const handleSearch = (searchTerm) => {
    setFilters(prevFilters => ({ ...prevFilters, searchTerm }));
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleSubjectDetails = (subjectId) => {
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(null);
      setIsEditing(false);
    } else {
      setSelectedSubjectId(subjectId);
      setIsEditing(false);
      const subject = subjects.find(sub => sub.subject_id === subjectId);
      setEditFormData(subject);
    }
  };

  const startEditing = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setIsEditing(true);
    const subject = subjects.find(sub => sub.subject_id === subjectId);
    setEditFormData(subject);
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
      await axios.put(`http://localhost:3001/subjects/${selectedSubjectId}`, editFormData);
      fetchSubjects();  // Refresh the subjects list after saving
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving subject details:', error);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    const subject = subjects.find(sub => sub.subject_id === selectedSubjectId);
    setEditFormData(subject);
  };

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Subjects</h1>
      <div className="subjects-search-filter-container">
        <SubjectsSearchFilter
          handleSearch={handleSearch}
          handleApplyFilters={handleApplyFilters}
        />
      </div>
      <div className="subjects-list">
        {filteredSubjects.map((subject, index) => (
          <div key={subject.subject_id} className="subject-item-container">
            <div className="subject-item">
              <p className="subject-name">{index + 1}. {subject.subject_name}</p>
              <span className="subject-info">Grade {subject.grade_level} - {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}</span>
              <div className="subject-actions">
                <button className="subject-view-button" onClick={() => toggleSubjectDetails(subject.subject_id)}>View</button>
                <button className="subject-edit-button" onClick={() => startEditing(subject.subject_id)}>Edit</button>
                <button className="subject-archive-button">Archive</button>
              </div>
            </div>
            {selectedSubjectId === subject.subject_id && (
              <div className="subject-details">
                <table>
                  <tbody>
                    <tr>
                      <th>Subject Name:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="subject_name"
                            value={editFormData.subject_name}
                            onChange={handleEditChange}
                          />
                        ) : (
                          subject.subject_name
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Grade Level:</th>
                      <td>
                        {isEditing ? (
                          <select
                            name="grade_level"
                            value={editFormData.grade_level}
                            onChange={handleEditChange}
                          >
                            <option value="">Select Grade</option>
                            {grades.map((grade, index) => (
                              <option key={index} value={grade}>{grade}</option>
                            ))}
                          </select>
                        ) : (
                          subject.grade_level
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
                          subject.status.charAt(0).toUpperCase() + subject.status.slice(1)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Grading Criteria:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="grading_criteria"
                            value={editFormData.grading_criteria}
                            onChange={handleEditChange}
                          />
                        ) : (
                          subject.grading_criteria
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Description:</th>
                      <td>
                        {isEditing ? (
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditChange}
                          />
                        ) : (
                          subject.description
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>School Year:</th>
                      <td>
                        {isEditing ? (
                          <select
                            name="school_year_id"
                            value={editFormData.school_year_id}
                            onChange={handleEditChange}
                          >
                            <option value="">Select School Year</option>
                            {schoolYears.map((year, index) => (
                              <option key={index} value={year}>{year}</option>
                            ))}
                          </select>
                        ) : (
                          subject.school_year
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {isEditing && (
                  <div className="subject-edit-buttons">
                    <button className="subject-save-button" onClick={saveChanges}>Save</button>
                    <button className="subject-cancel-button" onClick={cancelEditing}>Cancel</button>
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

export default SubjectsPage;
