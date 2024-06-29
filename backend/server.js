const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: 'root', // Your MySQL password
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
  let query = `SELECT student_id, lastname, firstname, middlename, current_yr_lvl, birthdate, gender, age, home_address, barangay, city_municipality, province, contact_number, email_address, mother_name, father_name, parent_address, father_occupation, mother_occupation, annual_hshld_income, number_of_siblings, father_educ_lvl, mother_educ_lvl, father_contact_number, mother_contact_number, student_status, section_id
               FROM student WHERE 1=1`;

  const queryParams = [];
  if (searchTerm) {
    query += ` AND (firstname LIKE ? OR lastname LIKE ?)`;
    queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }
  if (grade) {
    query += ` AND current_yr_lvl = ?`;
    queryParams.push(grade);
  }
  if (section) {
    query += ` AND section_id = ?`;
    queryParams.push(section);
  }
  if (school_year) {
    query += ` AND school_year = ?`;
    queryParams.push(school_year);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
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

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
