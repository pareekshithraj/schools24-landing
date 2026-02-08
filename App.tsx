import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SchoolRegistration from './pages/SchoolRegistration';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import News from './pages/News';
import Login from './pages/Login';
import DashboardSuperAdmin from './pages/DashboardSuperAdmin';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardTeacher from './pages/DashboardTeacher';
import DashboardStudent from './pages/DashboardStudent';
import DashboardDriver from './pages/DashboardDriver';
import DashboardParent from './pages/DashboardParent';
import Admissions from './pages/Admissions';
import Users from './pages/Users';
import Classes from './pages/Classes';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import Transport from './pages/Transport';
import Inventory from './pages/Inventory';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Unauthorized from './pages/Unauthorized';
import Payments from './pages/Payments';
import Uploads from './pages/Uploads';
import Setup from './pages/Setup';
import AuditLogs from './pages/AuditLogs';
import SuperAdminSchools from './pages/SuperAdminSchools';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/ToastProvider';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Navbar />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SchoolRegistration />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/news" element={<News />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/dashboard/unauthorized" element={<Unauthorized />} />
          <Route
            path="/dashboard/super-admin"
            element={
              <ProtectedRoute roles={['super_admin']}>
                <DashboardSuperAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/schools"
            element={
              <ProtectedRoute roles={['super_admin']}>
                <SuperAdminSchools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/teacher"
            element={
              <ProtectedRoute roles={['teacher']}>
                <DashboardTeacher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute roles={['student']}>
                <DashboardStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/driver"
            element={
              <ProtectedRoute roles={['driver']}>
                <DashboardDriver />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/parent"
            element={
              <ProtectedRoute roles={['parent']}>
                <DashboardParent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admissions"
            element={
              <ProtectedRoute roles={['admin']}>
                <Admissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute roles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/classes"
            element={
              <ProtectedRoute roles={['teacher', 'admin']}>
                <Classes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/attendance"
            element={
              <ProtectedRoute roles={['teacher', 'admin']}>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/exams"
            element={
              <ProtectedRoute roles={['teacher', 'admin']}>
                <Exams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/transport"
            element={
              <ProtectedRoute roles={['driver', 'admin']}>
                <Transport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/inventory"
            element={
              <ProtectedRoute roles={['admin']}>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/notifications"
            element={
              <ProtectedRoute roles={['teacher', 'admin']}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <ProtectedRoute roles={['admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/uploads"
            element={
              <ProtectedRoute roles={['admin']}>
                <Uploads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/audit"
            element={
              <ProtectedRoute roles={['super_admin']}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute roles={['parent', 'student', 'admin']}>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute roles={['super_admin', 'admin', 'teacher', 'student', 'driver', 'parent']}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
