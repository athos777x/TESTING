import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchFilter from '../Utilities/SearchFilter';
import '../CssPage/EmployeePage.css';

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    position: '',
    department: '',
    status: ''
  });

  useEffect(() => {
    fetchEmployees();
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
    setSelectedEmployeeId(selectedEmployeeId === employeeId ? null : employeeId);
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
          <div key={employee.employee_id} className="employee-item-container" onClick={() => toggleEmployeeDetails(employee.employee_id)}>
            <div className="employee-item">
              <p className="employee-name">
                {index + 1}. {employee.firstname} {employee.middlename && `${employee.middlename[0]}.`} {employee.lastname}
              </p>
              <span className="employee-info">{formatRoleName(employee.role_name)} - {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}</span>
              <button className="employee-view-button">View</button>
              <button className="employee-edit-button">Edit</button>
              <button className="employee-archive-button">Archive</button>
            </div>
            {selectedEmployeeId === employee.employee_id && (
              <div className="employee-details">
                <table>
                  <tbody>
                    <tr>
                      <th>First Name:</th>
                      <td>{employee.firstname}</td>
                    </tr>
                    <tr>
                      <th>Middle Name:</th>
                      <td>{employee.middlename}</td>
                    </tr>
                    <tr>
                      <th>Last Name:</th>
                      <td>{employee.lastname}</td>
                    </tr>
                    <tr>
                      <th>Contact Number:</th>
                      <td>{employee.contact_number}</td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>{employee.address}</td>
                    </tr>
                    <tr>
                      <th>Year Started:</th>
                      <td>{employee.year_started}</td>
                    </tr>
                    <tr>
                      <th>Role Name:</th>
                      <td>{formatRoleName(employee.role_name)}</td>
                    </tr>
                    <tr>
                      <th>Status:</th>
                      <td>{employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}</td>
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

export default EmployeePage;
