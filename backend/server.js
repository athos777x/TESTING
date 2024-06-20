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
  database: 'school_portal'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ authenticated: true, role: results[0].role });
    } else {
      res.json({ authenticated: false });
    }
  });
});

// Endpoint to fetch all students
app.get('/students', (req, res) => {
  const query = `
    SELECT s.*, sy.year AS school_year
    FROM students s
    JOIN school_years sy ON s.school_year_id = sy.school_year_id
  `;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Endpoint to fetch filter options
app.get('/filters', (req, res) => {
  const schoolYearsQuery = 'SELECT school_year_id, year FROM school_years';
  const gradesQuery = 'SELECT DISTINCT grade_level FROM students';
  const sectionsQuery = 'SELECT DISTINCT section FROM students';

  const schoolYearsPromise = new Promise((resolve, reject) => {
    db.query(schoolYearsQuery, (err, results) => {
      if (err) {
        console.error('Error fetching school years:', err);
        reject(err);
      } else {
        console.log('School Years results:', results);
        resolve(results);
      }
    });
  });

  const gradesPromise = new Promise((resolve, reject) => {
    db.query(gradesQuery, (err, results) => {
      if (err) {
        console.error('Error fetching grades:', err);
        reject(err);
      } else {
        console.log('Grades results:', results);
        resolve(results.map(row => row.grade_level));
      }
    });
  });

  const sectionsPromise = new Promise((resolve, reject) => {
    db.query(sectionsQuery, (err, results) => {
      if (err) {
        console.error('Error fetching sections:', err);
        reject(err);
      } else {
        console.log('Sections results:', results);
        resolve(results.map(row => row.section));
      }
    });
  });

  Promise.all([schoolYearsPromise, gradesPromise, sectionsPromise])
    .then(([schoolYears, grades, sections]) => {
      res.json({ schoolYears, grades, sections });
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to fetch filter options' });
    });
});

// Endpoint to fetch subjects based on grade level
app.get('/subjects/:gradeLevel', (req, res) => {
  const gradeLevel = req.params.gradeLevel;
  const query = 'SELECT * FROM subjects WHERE grade_level = ?';
  db.query(query, [gradeLevel], (err, results) => {
    if (err) {
      console.error('There was an error fetching the subjects!', err);
      res.status(500).json({ error: 'Failed to fetch subjects' });
    } else {
      res.json(results);
    }
  });
});

// Endpoint to fetch grades for a specific student including subject info based on grade level
app.get('/students/:id/grades', (req, res) => {
  const studentId = req.params.id;
  const query = `
    SELECT s.subject_name, s.grade_level, g.q1_grade, g.q2_grade, g.q3_grade, g.q4_grade
    FROM grades g
    JOIN subjects s ON g.subject_id = s.subject_id
    WHERE g.student_id = ?
  `;
  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('There was an error fetching the grades!', err);
      res.status(500).json({ error: 'Failed to fetch grades' });
    } else {
      res.json(results);
    }
  });
});

// Endpoint to fetch details of a specific student
app.get('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const query = 'SELECT * FROM students WHERE student_id = ?';
  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('There was an error fetching the student details!', err);
      res.status(500).json({ error: 'Failed to fetch student details' });
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  });
});

// Endpoint to fetch all details of a specific student including grades
app.get('/students/:id/details', (req, res) => {
  const studentId = req.params.id;

  // Query to get student information with school year
  const studentQuery = `
    SELECT s.*, sy.year AS school_year
    FROM students s
    JOIN school_years sy ON s.school_year_id = sy.school_year_id
    WHERE s.student_id = ?
  `;
  
  // Query to get student's grades
  const gradesQuery = `
    SELECT sub.subject_name, g.q1_grade, g.q2_grade, g.q3_grade, g.q4_grade
    FROM grades g
    JOIN subjects sub ON g.subject_id = sub.subject_id
    WHERE g.student_id = ?
  `;

  // Execute both queries
  db.query(studentQuery, [studentId], (err, studentResults) => {
    if (err) {
      console.error('There was an error fetching the student details!', err);
      res.status(500).json({ error: 'Failed to fetch student details' });
      return;
    }

    if (studentResults.length === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    db.query(gradesQuery, [studentId], (err, gradesResults) => {
      if (err) {
        console.error('There was an error fetching the grades!', err);
        res.status(500).json({ error: 'Failed to fetch grades' });
        return;
      }

      console.log('Grades fetched:', gradesResults);  // Log fetched grades

      // Restructure the grades to group by subject and quarters
      const gradesBySubject = {};
      gradesResults.forEach(result => {
        if (!gradesBySubject[result.subject_name]) {
          gradesBySubject[result.subject_name] = { q1_grade: null, q2_grade: null, q3_grade: null, q4_grade: null };
        }
        gradesBySubject[result.subject_name].q1_grade = result.q1_grade;
        gradesBySubject[result.subject_name].q2_grade = result.q2_grade;
        gradesBySubject[result.subject_name].q3_grade = result.q3_grade;
        gradesBySubject[result.subject_name].q4_grade = result.q4_grade;
      });

      const formattedGrades = Object.keys(gradesBySubject).map(subject => ({
        subject_name: subject,
        ...gradesBySubject[subject]
      }));

      console.log('Formatted grades:', formattedGrades);  // Log formatted grades

      const student = studentResults[0];
      student.grades = formattedGrades;

      res.json(student);
    });
  });
});

// Endpoint to fetch the employee list
app.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employees';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Endpoint to fetch distinct positions
app.get('/employees/positions', (req, res) => {
  const query = 'SELECT DISTINCT position FROM employees';
  db.query(query, (err, results) => {
    if (err) throw err;
    console.log('Fetched positions:', results); // Debug log
    res.json(results.map(row => row.position));
  });
});

// Endpoint to fetch distinct departments
app.get('/employees/departments', (req, res) => {
  const query = 'SELECT DISTINCT department FROM employees';
  db.query(query, (err, results) => {
    if (err) throw err;
    console.log('Fetched departments:', results); // Debug log
    res.json(results.map(row => row.department));
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
