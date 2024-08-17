import React, { useState, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import './CssFiles/LoginForm.css'; 
import LoginForm from './Utilities/LoginForm';
import Layout from './Utilities/Layout';
import HomePage from './Pages/HomePage';
import Principal_StudentsPage from './PrincipalPages/Principal_StudentsPage';
import Principal_GradesPage from './PrincipalPages/Principal_GradesPage';
import Principal_AttendancePage from './PrincipalPages/Principal_AttendancePage';
import Principal_EmployeePage from './PrincipalPages/Principal_EmployeePage';
import Principal_SchoolYearPage from './PrincipalPages/Principal_SchoolYearPage';
import Principal_EnrolledStudentsPage from './PrincipalPages/Principal_EnrolledStudentsPage';
import Principal_SubjectsPage from './PrincipalPages/Principal_SubjectsPage';
import Principal_SectionListPage from './PrincipalPages/Principal_SectionListPage';
import Principal_SectionPage from './PrincipalPages/Principal_SectionPage';
import Principal_ListofStudentEnrolleesPage from './PrincipalPages/Principal_ListofStudentEnrolleesPage';
import Principal_SummaryReportonPromotionPage from './PrincipalPages/Principal_SummaryReportonPromotionPage';
import Principal_EarlyEnrollmentReportPage from './PrincipalPages/Principal_EarlyEnrollmentReportPage';
import Principal_StudentDetailPage from './PrincipalPages/Principal_StudentDetailPage';
import Principal_SchedulePage from './PrincipalPages/Principal_SchedulePage'; 
import Student_ProfilePage from './StudentPages/Student_ProfilePage';
import Student_EnrollmentPage from './StudentPages/Student_EnrollmentPage';
import Student_SchedulePage from './StudentPages/Student_SchedulePage'; 
import Student_GradesPage from './StudentPages/Student_GradesPage';
import Student_AttendancePage from './StudentPages/Student_AttendancePage';
import Student_AccountPage from './StudentPages/Student_AccountPage';
import Registrar_StudentsPage from './RegistrarPages/Registrar_StudentsPage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    setRole(localStorage.getItem('role') || '');
  }, []);

  const handleLogin = (username, password, navigate, userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('role', userRole);
    navigate('/home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
        {isAuthenticated && (
          <Route element={<Layout role={role} handleLogout={handleLogout} />}>
            <Route path="/home" element={<HomePage />} />

            <Route path="/section-list" element={<Principal_SectionListPage />} />
            <Route path="/section" element={<Principal_SectionPage />} />
            <Route path="/students" element={<Principal_StudentsPage />} />
            <Route path="/students/:id/details" element={<Principal_StudentDetailPage />} />
            <Route path="/grades" element={<Principal_GradesPage />} />
            <Route path="/attendance" element={<Principal_AttendancePage />} />
            <Route path="/employees" element={<Principal_EmployeePage />} />
            <Route path="/school-year" element={<Principal_SchoolYearPage />} />
            <Route path="/enrolled-students" element={<Principal_EnrolledStudentsPage />} />
            <Route path="/subjects" element={<Principal_SubjectsPage />} />
            <Route path="/list-of-student-enrollees" element={<Principal_ListofStudentEnrolleesPage />} />
            <Route path="/summary-report-promotion" element={<Principal_SummaryReportonPromotionPage />} />
            <Route path="/early-enrollment-report" element={<Principal_EarlyEnrollmentReportPage />} />
            <Route path="/schedule" element={<Principal_SchedulePage />} />

            <Route path="/profile" element={<Student_ProfilePage />} />
            <Route path="/student-schedule" element={<Student_SchedulePage />} />
            <Route path="/student-grades" element={<Student_GradesPage />} />
            <Route path="/student-attendance" element={<Student_AttendancePage />} />
            <Route path="/enrollment" element={<Student_EnrollmentPage />} />
            <Route path="/account" element={<Student_AccountPage />} />

            <Route path="/registrar-students" element={<Registrar_StudentsPage />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/home' : '/'} />} />
      </Routes>
    </Router>
  );
}

export default App;
