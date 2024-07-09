const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'lnhsportal'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

const roleMap = {
  1: 'principal',
  2: 'student'
};

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: username=${username}, password=${password}`);
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      const role = roleMap[user.role_id];
      console.log('Login successful:', user);
      res.json({ authenticated: true, userId: user.user_id, role });
    } else {
      console.log('Login failed: invalid username or password');
      res.json({ authenticated: false });
    }
  });
});

// Endpoint to fetch user details by ID
app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`Fetching user details for userId: ${userId}`);
  const query = `
    SELECT e.firstname, e.lastname, e.middlename, u.username, u.role_id
    FROM users u 
    JOIN employee e ON u.user_id = e.user_id 
    WHERE u.user_id = ?
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    if (results.length > 0) {
      console.log('User details found:', results[0]);
      res.json(results[0]);
    } else {
      console.log('User not found for userId:', userId);
      res.status(404).json({ error: 'User not found' });
    }
  });
});

// Endpoint to fetch all students
app.get('/students', (req, res) => {
  const { searchTerm, grade, section, school_year } = req.query;
  console.log('Received params:', { searchTerm, grade, section, school_year });

  const latestSchoolYear = '2023-2024'; // Define the latest school year

  let query = `
    SELECT s.student_id, s.lastname, s.firstname, s.middlename, s.current_yr_lvl, s.birthdate, s.gender, s.age, 
           s.home_address, s.barangay, s.city_municipality, s.province, s.contact_number, s.email_address, 
           s.mother_name, s.father_name, s.parent_address, s.father_occupation, s.mother_occupation, s.annual_hshld_income, 
           s.number_of_siblings, s.father_educ_lvl, s.mother_educ_lvl, s.father_contact_number, s.mother_contact_number,
           (SELECT ss.status FROM student_school_year ss
            JOIN school_year sy ON ss.school_year_id = sy.school_year_id
            WHERE ss.student_id = s.student_id AND sy.school_year = '${latestSchoolYear}') as active_status
    FROM student s
  `;
  const queryParams = [];
  const conditions = [];

  if (school_year) {
    query = `
      SELECT s.student_id, s.lastname, s.firstname, s.middlename, s.current_yr_lvl, s.birthdate, s.gender, s.age, 
             s.home_address, s.barangay, s.city_municipality, s.province, s.contact_number, s.email_address, 
             s.mother_name, s.father_name, s.parent_address, s.father_occupation, s.mother_occupation, s.annual_hshld_income, 
             s.number_of_siblings, s.father_educ_lvl, s.mother_educ_lvl, s.father_contact_number, s.mother_contact_number, 
             ss.status, sy.school_year,
             (CASE WHEN sy.school_year = '${latestSchoolYear}' THEN ss.status ELSE 'inactive' END) as active_status
      FROM student s
      JOIN student_school_year ss ON s.student_id = ss.student_id
      JOIN school_year sy ON ss.school_year_id = sy.school_year_id
      WHERE sy.school_year = ?
    `;
    queryParams.push(school_year);

    if (school_year === latestSchoolYear) {
      conditions.push(`ss.status = 'active'`);
    }
  }

  if (searchTerm) {
    conditions.push(`(s.firstname LIKE ? OR s.lastname LIKE ?)`); 
    queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }
  if (grade) {
    conditions.push(`s.current_yr_lvl = ?`);
    queryParams.push(grade);
  }
  if (section) {
    conditions.push(`s.section_id = ?`);
    queryParams.push(section);
  }

  if (conditions.length > 0) {
    query += (school_year ? ' AND ' : ' WHERE ') + conditions.join(' AND ');
  }

  query += ' ORDER BY s.firstname'; // Add ORDER BY clause to sort by first name

  console.log('Final query:', query);
  console.log('With parameters:', queryParams);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Query results:', results);
    res.json(results);
  });
});

// Endpoint to fetch grades for a specific student
app.get('/students/:student_id/grades', (req, res) => {
  const { student_id } = req.params;
  const query = `SELECT g.first_quarter AS q1_grade, g.second_quarter AS q2_grade, g.third_quarter AS q3_grade, g.fourth_quarter AS q4_grade, s.subject_name
                 FROM grades g
                 JOIN schedule sc ON g.schedule_id = sc.schedule_id
                 JOIN subject s ON sc.subject_id = s.subject_id
                 JOIN enrollment e ON g.enrollment_id = e.enrollment_id
                 WHERE e.student_id = ?`;
  db.query(query, [student_id], (err, results) => {
    if (err) {
      console.error('Error fetching grades:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to fetch sections for select section filter for StudentsPage, GradesPage, and AttendancePage
app.get('/api/sections', (req, res) => {
  const query = 'SELECT section_id, section_name FROM section';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sections:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to fetch positions
app.get('/api/positions', (req, res) => {
  const query = 'SELECT DISTINCT role_name FROM employee';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching positions:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results.map(role => role.role_name));
  });
});

// Endpoint to fetch departments
app.get('/api/departments', (req, res) => {
  const query = 'SELECT DISTINCT department FROM employee';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching departments:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results.map(department => department.department));
  });
});

// Fetch filter options for school year and grades
app.get('/filters', (req, res) => {
  const filters = {
    schoolYears: [],
    grades: ['7', '8', '9', '10'],
    sections: []
  };

  const sqlSchoolYears = 'SELECT DISTINCT current_yr_lvl AS year FROM student ORDER BY current_yr_lvl';

  db.query(sqlSchoolYears, (err, result) => {
    if (err) {
      console.error('Error fetching school years:', err);
      res.status(500).send(err);
      return;
    } else {
      filters.schoolYears = result;

      const sqlSections = 'SELECT * FROM section';
      db.query(sqlSections, (err, result) => {
        if (err) {
          console.error('Error fetching sections:', err);
          res.status(500).send(err);
          return;
        } else {
          filters.sections = result;
          res.send(filters);
        }
      });
    }
  });
});

// Endpoint to fetch attendance data for a specific student
app.get('/attendance/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const query = `
    SELECT a.status, COUNT(*) as count
    FROM attendance a
    JOIN enrollment e ON a.enrollment_id = e.enrollment_id
    WHERE e.student_id = ?
    GROUP BY a.status
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching attendance data:', err);
      res.status(500).send('Error fetching attendance data');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Attendance data not found');
      return;
    }

    const attendanceData = {
      total_school_days: results.reduce((acc, curr) => acc + curr.count, 0),
      days_present: results.find(r => r.status === 'P')?.count || 0,
      days_absent: results.find(r => r.status === 'A')?.count || 0,
      days_late: results.find(r => r.status === 'L')?.count || 0,
      brigada_attendance: results.find(r => r.status === 'B')?.count || 0
    };

    res.json(attendanceData);
  });
});

// Fetch school years
app.get('/api/school_years', (req, res) => {
  const query = 'SELECT school_year FROM school_year ORDER BY school_year DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching school years:', err);
      res.status(500).send('Error fetching school years');
      return;
    }
    res.json(results);
  });
});

// Endpoint to fetch the current school year
app.get('/current-school-year', (req, res) => {
  try {
    const currentSchoolYear = '2023-2024'; // Replace with actual logic to fetch from database
    res.json({ schoolYear: currentSchoolYear });
  } catch (error) {
    res.status(500).send('Error fetching current school year');
  }
});

// Endpoint to fetch student details
app.get('/students/:id/details', (req, res) => {
  const studentId = req.params.id;

  const query = `
    SELECT s.student_id, s.lastname, s.firstname, s.middlename, s.current_yr_lvl, s.birthdate, s.gender, s.age,
           s.home_address, s.barangay, s.city_municipality, s.province, s.contact_number, s.email_address,
           s.mother_name, s.father_name, s.parent_address, s.father_occupation, s.mother_occupation, s.annual_hshld_income,
           s.number_of_siblings, s.father_educ_lvl, s.mother_educ_lvl, s.father_contact_number, s.mother_contact_number,
           ss.status, sy.school_year
    FROM student s
    LEFT JOIN student_school_year ss ON s.student_id = ss.student_id
    LEFT JOIN school_year sy ON ss.school_year_id = sy.school_year_id
    WHERE s.student_id = ?
    ORDER BY sy.school_year DESC
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching student details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const studentDetails = results.map(result => ({
      studentId: result.student_id,
      lastname: result.lastname,
      firstname: result.firstname,
      middlename: result.middlename,
      currentYearLevel: result.current_yr_lvl,
      birthdate: result.birthdate,
      gender: result.gender,
      age: result.age,
      homeAddress: result.home_address,
      barangay: result.barangay,
      cityMunicipality: result.city_municipality,
      province: result.province,
      contactNumber: result.contact_number,
      emailAddress: result.email_address,
      motherName: result.mother_name,
      fatherName: result.father_name,
      parentAddress: result.parent_address,
      fatherOccupation: result.father_occupation,
      motherOccupation: result.mother_occupation,
      annualHouseholdIncome: result.annual_hshld_income,
      numberOfSiblings: result.number_of_siblings,
      fatherEducationLevel: result.father_educ_lvl,
      motherEducationLevel: result.mother_educ_lvl,
      fatherContactNumber: result.father_contact_number,
      motherContactNumber: result.mother_contact_number,
      status: result.status,
      schoolYear: result.school_year
    }));

    res.json(studentDetails);
  });
});

// Endpoint to fetch all employees
app.get('/employees', (req, res) => {
  const { status, position, department, searchTerm, showArchive } = req.query;

  let query = 'SELECT * FROM employee WHERE 1=1';
  const queryParams = [];

  if (status === 'showAll') {
    // Show all employees, including archived ones
  } else if (status) {
    // Filter by status and exclude archived employees
    query += ' AND status = ?';
    queryParams.push(status);
  }

  if (showArchive === 'archive') {
    query += ' AND archive_status = "archive"';
  } else if (showArchive === 'unarchive') {
    query += ' AND archive_status = "unarchive"';
  }

  if (position) {
    const formattedPosition = position.replace(/\s/g, '_').toLowerCase();
    query += ' AND role_name = ?';
    queryParams.push(formattedPosition);
  }

  if (department) {
    query += ' AND department = ?';
    queryParams.push(department);
  }

  if (searchTerm) {
    query += ' AND (firstname LIKE ? OR lastname LIKE ?)';
    queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  query += ' ORDER BY firstname';

  console.log('Final query:', query);
  console.log('With parameters:', queryParams);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to fetch employee details by ID
app.get('/employees/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const query = 'SELECT * FROM employee WHERE employee_id = ?';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching employee details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  });
});

// Endpoint to update employee details by ID
app.put('/employees/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployee = req.body;

  console.log(`Updating employee with ID: ${employeeId}`, updatedEmployee);

  // Fetch the role_id based on the role_name
  const roleQuery = 'SELECT role_id FROM roles WHERE role_name = ?';
  db.query(roleQuery, [updatedEmployee.role_name], (err, roleResults) => {
    if (err) {
      console.error('Error fetching role ID:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (roleResults.length > 0) {
      const roleId = roleResults[0].role_id;
      updatedEmployee.role_id = roleId;

      console.log('Role ID fetched:', roleId);

      const query = 'UPDATE employee SET ? WHERE employee_id = ?';
      db.query(query, [updatedEmployee, employeeId], (err, results) => {
        if (err) {
          console.error('Error updating employee details:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        if (results.affectedRows > 0) {
          res.json({ message: 'Employee updated successfully' });
        } else {
          res.status(404).json({ error: 'Employee not found' });
        }
      });
    } else {
      console.error('Role not found:', updatedEmployee.role_name);
      res.status(404).json({ error: 'Role not found' });
    }
  });
});

// Endpoint to archive an employee
app.put('/employees/:employeeId/archive', (req, res) => {
  const { employeeId } = req.params;
  const query = 'UPDATE employee SET archive_status = "archive", status = "inactive" WHERE employee_id = ?';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error archiving employee:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.affectedRows > 0) {
      res.json({ message: 'Employee archived and set to inactive successfully' });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  });
});

// Endpoint to unarchive an employee
app.put('/employees/:employeeId/unarchive', (req, res) => {
  const { employeeId } = req.params;
  const query = 'UPDATE employee SET archive_status = "unarchive", status = "active" WHERE employee_id = ?';
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error unarchiving employee:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.affectedRows > 0) {
      res.json({ message: 'Employee unarchived and set to active successfully' });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  });
});

// Endpoint to fetch roles
app.get('/roles', (req, res) => {
  const query = 'SELECT role_name FROM roles';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching roles:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results.map(role => role.role_name));
  });
});

// Fetch all school years
app.get('/school-years', (req, res) => {
  const { searchTerm, school_year } = req.query;

  let query = 'SELECT * FROM school_year';
  let queryParams = [];

  if (searchTerm || school_year) {
    query += ' WHERE';
    if (searchTerm) {
      query += ' school_year LIKE ?';
      queryParams.push(`%${searchTerm}%`);
    }
    if (school_year) {
      if (searchTerm) query += ' AND';
      query += ' school_year = ?';
      queryParams.push(school_year);
    }
  } else {
    query += ' WHERE status = "active"'; // Default filter to show only active school years
  }

  console.log('Query:', query);
  console.log('QueryParams:', queryParams);

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error('Error fetching school years:', err); // Detailed error logging
      res.status(500).send({ error: 'Error fetching school years', details: err.message });
    } else {
      console.log('Result:', result);
      res.send(result);
    }
  });
});

// Fetch specific school year details
app.get('/school-years/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM school_year WHERE school_year_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching school year details:', err); // Detailed error logging
      res.status(500).send({ error: 'Error fetching school year details', details: err.message });
    } else {
      res.send(result);
    }
  });
});

// Endpoint to add a new school year
app.post('/school-years', (req, res) => {
  const { school_year, school_year_start, school_year_end, enrollment_start, enrollment_end, status } = req.body;
  const query = 'INSERT INTO school_year (school_year, school_year_start, school_year_end, enrollment_start, enrollment_end, status) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(query, [school_year, school_year_start, school_year_end, enrollment_start, enrollment_end, status], (err, result) => {
    if (err) {
      console.error('Error adding school year:', err);
      res.status(500).send({ error: 'Error adding school year', details: err.message });
    } else {
      res.status(201).send({ message: 'School year added successfully' });
    }
  });
});

// Endpoint to update school year details by ID
app.put('/school-years/:schoolYearId', (req, res) => {
  const { schoolYearId } = req.params;
  const updatedSchoolYear = req.body;

  const query = 'UPDATE school_year SET ? WHERE school_year_id = ?';
  db.query(query, [updatedSchoolYear, schoolYearId], (err, results) => {
    if (err) {
      console.error('Error updating school year details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.affectedRows > 0) {
      res.json({ message: 'School year updated successfully' });
    } else {
      res.status(404).json({ error: 'School year not found' });
    }
  });
});

// Endpoint to fetch sections for SectionPage
app.get('/sections', (req, res) => {
  const { searchTerm, grade } = req.query;
  const query = `
    SELECT s.section_id, s.section_name, s.grade_level, s.status, s.max_capacity, sy.school_year
    FROM section s
    JOIN section_open so ON s.section_id = so.section_id
    JOIN school_year sy ON so.school_year_id = sy.school_year_id
    WHERE sy.status = 'active'
  `;
  const queryParams = [];

  if (searchTerm) {
    query += ' AND s.section_name LIKE ?';
    queryParams.push(`%${searchTerm}%`);
  }

  if (grade) {
    query += ' AND s.grade_level = ?';
    queryParams.push(grade);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching sections:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint to fetch section details by ID
app.get('/sections/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT s.section_id, s.section_name, s.grade_level, s.status, s.max_capacity, sy.school_year
    FROM section s
    JOIN section_open so ON s.section_id = so.section_id
    JOIN school_year sy ON so.school_year_id = sy.school_year_id
    WHERE s.section_id = ?
  `;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching section details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(result[0]);
  });
});

// Fetch students by section ID and segregate by gender
app.get('/sections/:id/students', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM student WHERE section_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching students:', err); // Detailed error logging
      return res.status(500).send({ error: 'Error fetching students', details: err.message });
    }
    console.log('Fetched students:', result); // Log the fetched students
    const boys = result.filter(student => student.gender === 'Male');
    const girls = result.filter(student => student.gender === 'Female');
    res.json({ boys, girls });
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
