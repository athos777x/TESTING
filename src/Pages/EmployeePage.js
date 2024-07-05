import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchFilter from '../Utilities/SearchFilter';
import '../CssPage/EmployeePage.css';

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [filters, setFilters] = useState({
    searchTerm: '',
    position: '',
    department: '',
    status: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const fetchEmployees = async (appliedFilters = {}) => {
    try {
      const response = await axios.get('http://localhost:3001/employees', {
        params: appliedFilters
      });
      const sortedEmployees = response.data.sort((a, b) => a.firstname.localeCompare(b.firstname));
      setEmployees(sortedEmployees);
      setFilteredEmployees(sortedEmployees);
      console.log('Fetched employees:', sortedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/roles');
      setRoles(response.data);
      console.log('Fetched roles:', response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, searchTerm };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, [type]: value };
      return updatedFilters;
    });
  };

  const applyFilters = (updatedFilters) => {
    let filtered = employees;

    if (updatedFilters.position) {
      filtered = filtered.filter(employee => employee.role_name === updatedFilters.position);
    }
    if (updatedFilters.department) {
      filtered = filtered.filter(employee => employee.department === updatedFilters.department);
    }
    if (updatedFilters.status) {
      filtered = filtered.filter(employee => employee.status === updatedFilters.status);
    }
    if (updatedFilters.searchTerm) {
      filtered = filtered.filter(employee =>
        employee.firstname.toLowerCase().includes(updatedFilters.searchTerm.toLowerCase()) ||
        employee.lastname.toLowerCase().includes(updatedFilters.searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
    console.log('Filtered employees:', filtered);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    fetchEmployees(filters);
  };

  const toggleEmployeeDetails = (employeeId) => {
    if (selectedEmployeeId === employeeId) {
      setSelectedEmployeeId(null);
      setIsEditing(false);
    } else {
      setSelectedEmployeeId(employeeId);
      setIsEditing(false);
      const employee = employees.find(emp => emp.employee_id === employeeId);
      setEditFormData(employee);
    }
  };

  const startEditing = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setIsEditing(true);
    const employee = employees.find(emp => emp.employee_id === employeeId);
    setEditFormData(employee);
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
      await axios.put(`http://localhost:3001/employees/${selectedEmployeeId}`, editFormData);
      fetchEmployees();  // Refresh the employee list after saving
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving employee details:', error);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    const employee = employees.find(emp => emp.employee_id === selectedEmployeeId);
    setEditFormData(employee);
  };

  const formatRoleName = (roleName) => {
    return roleName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="employee-container">
      <h1 className="employee-title">Employees</h1>
      <div className="employee-search-filter-container">
        <SearchFilter
          handleSearch={handleSearch}
          handleFilter={handleFilterChange}
          handleApplyFilters={handleApplyFilters}
        />
      </div>
      <div className="employee-list">
        {filteredEmployees.map((employee, index) => (
          <div key={employee.employee_id} className="employee-item-container">
            <div className="employee-item">
              <p className="employee-name">
                {index + 1}. {employee.firstname} {employee.middlename && `${employee.middlename[0]}.`} {employee.lastname}
              </p>
              <span className="employee-info">{formatRoleName(employee.role_name)} - {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}</span>
              <div className="employee-actions">
                <button className="employee-view-button" onClick={() => toggleEmployeeDetails(employee.employee_id)}>View</button>
                <button className="employee-edit-button" onClick={() => startEditing(employee.employee_id)}>Edit</button>
                <button className="employee-archive-button">Archive</button>
              </div>
            </div>
            {selectedEmployeeId === employee.employee_id && (
              <div className="employee-details">
                <table>
                  <tbody>
                    <tr>
                      <th>First Name:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstname"
                            value={editFormData.firstname}
                            onChange={handleEditChange}
                          />
                        ) : (
                          employee.firstname
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Middle Name:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="middlename"
                            value={editFormData.middlename}
                            onChange={handleEditChange}
                          />
                        ) : (
                          employee.middlename
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Last Name:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastname"
                            value={editFormData.lastname}
                            onChange={handleEditChange}
                          />
                        ) : (
                          employee.lastname
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Contact Number:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="contact_number"
                            value={editFormData.contact_number}
                            onChange={handleEditChange}
                          />
                        ) : (
                          employee.contact_number
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="address"
                            value={editFormData.address}
                            onChange={handleEditChange}
                          />
                        ) : (
                          employee.address
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Year Started:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="year_started"
                            value={editFormData.year_started}
                            onChange={handleEditChange}
                          />
                        ) : (
                          employee.year_started
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Role Name:</th>
                      <td>
                        {isEditing ? (
                          <select
                            name="role_name"
                            value={editFormData.role_name}
                            onChange={handleEditChange}
                          >
                            {roles.map((role, index) => (
                              <option key={index} value={role}>{role}</option>
                            ))}
                          </select>
                        ) : (
                          formatRoleName(employee.role_name)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Status:</th>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="status"
                            value={editFormData.status}
                            onChange={handleEditChange}
                          />
                        ) : (
                          employee.status.charAt(0).toUpperCase() + employee.status.slice(1)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {isEditing && (
                  <div className="edit-buttons">
                    <button className="save-button" onClick={saveChanges}>Save</button>
                    <button className="cancel-button" onClick={cancelEditing}>Cancel</button>
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

export default EmployeePage;
