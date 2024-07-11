// App.js
import React, { useState, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import './CssPage/LoginForm.css'; // Import the new CSS file
import StudentDashboard from './RoleDashboard/StudentDashboard';
import PrincipalDashboard from './RoleDashboard/PrincipalDashboard';
import LoginForm from './Utilities/LoginForm';
import Layout from './Utilities/Layout';
import ProfilePage from './Pages/ProfilePage';
import AcademicRecordPage from './Pages/AcademicRecordPage';
import EnrollmentPage from './Pages/EnrollmentPage';
import SectionListPage from './Pages/SectionListPage';
import SectionPage from './Pages/SectionPage';
import HomePage from './Pages/HomePage';
import StudentsPage from './Pages/StudentsPage';
import GradesPage from './Pages/GradesPage';
import AttendancePage from './Pages/AttendancePage';
import EmployeePage from './Pages/EmployeePage';
import SchoolYearPage from './Pages/SchoolYearPage';
import EnrolledStudentsPage from './Pages/EnrolledStudentsPage';
import SubjectsPage from './Pages/SubjectsPage';
import GenerateReportsPage from './Pages/GenerateReportsPage';
import ListofStudentEnrolleesPage from './Pages/ListofStudentEnrolleesPage';
import SummaryReportonPromotionPage from './Pages/SummaryReportonPromotionPage';
import EarlyEnrollmentReportPage from './Pages/EarlyEnrollmentReportPage';
import StudentDetailPage from './Pages/StudentDetailPage';
import SchedulePage from './Pages/SchedulePage'; // Import the SchedulePage

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
    if (userRole === 'principal') {
      navigate('/principal-dashboard');
    } else if (userRole === 'student') {
      navigate('/student-dashboard');
    }
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
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/principal-dashboard" element={<PrincipalDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/academic-record" element={<AcademicRecordPage />} />
            <Route path="/enrollment" element={<EnrollmentPage />} />
            <Route path="/section-list" element={<SectionListPage />} />
            <Route path="/section" element={<SectionPage />} />
            <Route path="/home" element={<HomePage />} />
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
        <Route path="*" element={<Navigate to={isAuthenticated ? (role === 'principal' ? '/principal-dashboard' : '/student-dashboard') : '/'} />} />
      </Routes>
    </Router>
  );
}

export default App;
