import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchFilter from '../Utilities/SearchFilter';
import '../CssPage/EmployeePage.css';

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    position: '',
    department: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (appliedFilters = {}) => {
    try {
      const response = await axios.get('http://localhost:3001/employees', {
        params: appliedFilters
      });
      console.log('API response:', response.data); // Log the API response
      const sortedEmployees = response.data.sort((a, b) => a.lastname.localeCompare(b.lastname));
      setEmployees(sortedEmployees);
      setFilteredEmployees(sortedEmployees);
      console.log('Sorted employees:', sortedEmployees); // Log the sorted employees
    } catch (error) {
      console.error('There was an error fetching the employees!', error);
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
      filtered = filtered.filter(employee => employee.position === updatedFilters.position);
    }
    if (updatedFilters.department) {
      filtered = filtered.filter(employee => employee.department === updatedFilters.department);
    }
    if (updatedFilters.searchTerm) {
      filtered = filtered.filter(employee =>
        employee.lastname.toLowerCase().includes(updatedFilters.searchTerm.toLowerCase()) ||
        employee.firstname.toLowerCase().includes(updatedFilters.searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
    console.log('Filtered employees:', filtered); // Log the filtered employees
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    fetchEmployees(filters);
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
              <span className="employee-info">{employee.role_name} - {employee.contact_number}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeePage;
