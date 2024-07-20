import React, { useState, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import './CssPage/LoginForm.css'; // Import the new CSS file
import StudentDashboard from './RoleDashboard/StudentDashboard';
import PrincipalDashboard from './RoleDashboard/PrincipalDashboard';
import RegistrarDashboard from './RoleDashboard/RegistrarDashboard';
import SubjectTeacherDashboard from './RoleDashboard/SubjectTeacherDashboard';
import ClassAdviserDashboard from './RoleDashboard/ClassAdviserDashboard';
import AcademicCoordinatorDashboard from './RoleDashboard/AcademicCoordinatorDashboard';
import GradeLevelCoordinatorDashboard from './RoleDashboard/GradeLevelCoordinatorDashboard';
import SubjectCoordinatorDashboard from './RoleDashboard/SubjectCoordinatorDashboard';
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
    switch (userRole) {
      case 'principal':
        navigate('/principal-dashboard');
        break;
      case 'student':
        navigate('/student-dashboard');
        break;
      case 'registrar':
        navigate('/registrar-dashboard');
        break;
      case 'subject_teacher':
        navigate('/subject-teacher-dashboard');
        break;
      case 'class_adviser':
        navigate('/class-adviser-dashboard');
        break;
      case 'academic_coordinator':
        navigate('/academic-coordinator-dashboard');
        break;
      case 'grade_level_coordinator':
        navigate('/grade-level-coordinator-dashboard');
        break;
      case 'subject_coordinator':
        navigate('/subject-coordinator-dashboard');
        break;
      default:
        break;
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
            <Route path="/registrar-dashboard" element={<RegistrarDashboard />} />
            <Route path="/subject-teacher-dashboard" element={<SubjectTeacherDashboard />} />
            <Route path="/class-adviser-dashboard" element={<ClassAdviserDashboard />} />
            <Route path="/academic-coordinator-dashboard" element={<AcademicCoordinatorDashboard />} />
            <Route path="/grade-level-coordinator-dashboard" element={<GradeLevelCoordinatorDashboard />} />
            <Route path="/subject-coordinator-dashboard" element={<SubjectCoordinatorDashboard />} />
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
        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? role === 'principal'
                    ? '/principal-dashboard'
                    : role === 'student'
                    ? '/student-dashboard'
                    : role === 'registrar'
                    ? '/registrar-dashboard'
                    : role === 'subject_teacher'
                    ? '/subject-teacher-dashboard'
                    : role === 'class_adviser'
                    ? '/class-adviser-dashboard'
                    : role === 'academic_coordinator'
                    ? '/academic-coordinator-dashboard'
                    : role === 'grade_level_coordinator'
                    ? '/grade-level-coordinator-dashboard'
                    : role === 'subject_coordinator'
                    ? '/subject-coordinator-dashboard'
                    : '/'
                  : '/'
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
