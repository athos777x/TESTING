// EmployeePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CssPage/EmployeePage.css'; // Make sure to create and link this CSS file

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    position: '',
    department: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3001/employees')
      .then(response => {
        setEmployees(response.data);
        setFilteredEmployees(response.data);
        console.log('Fetched employees:', response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the employees!', error);
      });

    axios.get('http://localhost:3001/employees/positions')
      .then(response => {
        setPositions(response.data);
        console.log('Fetched positions:', response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the positions!', error);
      });

    axios.get('http://localhost:3001/employees/departments')
      .then(response => {
        setDepartments(response.data);
        console.log('Fetched departments:', response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the departments!', error);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    setFilters(prevFilters => ({ ...prevFilters, searchTerm }));
  };

  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [type]: value }));
  };

  const handleApplyFilters = () => {
    let filtered = employees;

    if (filters.searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    if (filters.position) {
      filtered = filtered.filter(employee => employee.position === filters.position);
    }
    if (filters.department) {
      filtered = filtered.filter(employee => employee.department === filters.department);
    }

    setFilteredEmployees(filtered);
    console.log('Filtered employees:', filtered);
  };

  return (
    <div className="employee-container">
      <h1 className="employee-title">Employees</h1>
      <div className="search-filter-container">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div>
            <label htmlFor="position">Position:</label>
            <select
              id="position"
              value={filters.position}
              onChange={(e) => handleFilterChange('position', e.target.value)}
            >
              <option value="">All Positions</option>
              {positions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="department">Department:</label>
            <select
              id="department"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
          <button onClick={handleApplyFilters}>Apply Filters</button>
        </div>
      </div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(employee => (
            <tr key={employee.employee_id}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.department}</td>
              <td>{employee.email}</td>
              <td>{employee.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeePage;
