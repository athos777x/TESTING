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
      res.json({ authenticated: true, role });
    } else {
      console.log('Login failed: invalid username or password');
      res.json({ authenticated: false });
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

// Endpoint to fetch sections
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

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
