import React, { useState, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import './CssPage/LoginForm.css'; 
import LoginForm from './Utilities/LoginForm';
import Layout from './Utilities/Layout';
import ProfilePage from './Pages/ProfilePage';
import AcademicRecordPage from './Pages/AcademicRecordPage';
import EnrollmentPage from './Pages/EnrollmentPage';
import SectionListPage from './PrincipalPages/Principal_SectionListPage';
import SectionPage from './PrincipalPages/Principal_SectionPage';
import HomePage from './Pages/HomePage';
import StudentsPage from './PrincipalPages/Principal_StudentsPage';
import GradesPage from './PrincipalPages/Principal_GradesPage';
import AttendancePage from './PrincipalPages/Principal_AttendancePage';
import EmployeePage from './PrincipalPages/Principal_EmployeePage';
import SchoolYearPage from './PrincipalPages/Principal_SchoolYearPage';
import EnrolledStudentsPage from './PrincipalPages/Principal_EnrolledStudentsPage';
import SubjectsPage from './PrincipalPages/Principal_SubjectsPage';
import GenerateReportsPage from './Pages/GenerateReportsPage';
import ListofStudentEnrolleesPage from './Pages/ListofStudentEnrolleesPage';
import SummaryReportonPromotionPage from './Pages/SummaryReportonPromotionPage';
import EarlyEnrollmentReportPage from './Pages/EarlyEnrollmentReportPage';
import StudentDetailPage from './PrincipalPages/Principal_StudentDetailPage';
import SchedulePage from './PrincipalPages/Principal_SchedulePage'; 

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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/academic-record" element={<AcademicRecordPage />} />
            <Route path="/enrollment" element={<EnrollmentPage />} />
            <Route path="/section-list" element={<SectionListPage />} />
            <Route path="/section" element={<SectionPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/:id/details" element={<StudentDetailPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/school-year" element={<SchoolYearPage />} />
            <Route path="/enrolled-students" element={<EnrolledStudentsPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/generate-reports" element={<GenerateReportsPage />} />
            <Route path="/list-of-student-enrollees" element={<ListofStudentEnrolleesPage />} />
            <Route path="/summary-report-promotion" element={<SummaryReportonPromotionPage />} />
            <Route path="/early-enrollment-report" element={<EarlyEnrollmentReportPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/home' : '/'} />} />
      </Routes>
    </Router>
  );
}

export default App;
