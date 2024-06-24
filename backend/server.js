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
  const query = `SELECT student_id, lastname, firstname, middlename, current_yr_lvl, birthdate, gender, age, home_address, barangay, city_municipality, province, contact_number, email_address, mother_name, father_name, parent_address, father_occupation, mother_occupation, annual_hshld_income, number_of_siblings, father_educ_lvl, mother_educ_lvl, father_contact_number, mother_contact_number, student_status
                 FROM student`;
  db.query(query, (err, results) => {
    if (err) throw err;
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
    if (err) throw err;
    res.json(results);
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
