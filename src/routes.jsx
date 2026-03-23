import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Home            from './pages/Home';
import Login           from './pages/auth/Login';
import Register        from './pages/auth/Register';
import CourseList      from './pages/courses/CourseList';
import CourseDetails   from './pages/courses/CourseDetails';
import EnrollCourse    from './pages/courses/EnrollCourse';

import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses        from './pages/student/MyCourses';
import Profile          from './pages/student/Profile';

import AdminDashboard    from './pages/admin/AdminDashboard';
import ManageCourses     from './pages/admin/ManageCourses';
import ManageStudents    from './pages/admin/ManageStudents';
import ManageInstructors from './pages/admin/ManageInstructors';
import Enrollments       from './pages/admin/Enrollments';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"            element={<Home />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/register"    element={<Register />} />
      <Route path="/courses"     element={<CourseList />} />
      <Route path="/courses/:id" element={<CourseDetails />} />

      {/* Student: enroll */}
      <Route path="/courses/:id/enroll" element={
        <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
          <EnrollCourse />
        </ProtectedRoute>
      } />

      {/* Student pages */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/courses" element={
        <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
          <MyCourses />
        </ProtectedRoute>
      } />
      <Route path="/student/profile" element={
        <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Admin-only pages */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <ManageStudents />
        </ProtectedRoute>
      } />
      <Route path="/admin/instructors" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <ManageInstructors />
        </ProtectedRoute>
      } />

      {/* ── ISSUE 3 FIX: INSTRUCTOR can access courses + enrollments ── */}
      <Route path="/admin/courses" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTOR']}>
          <ManageCourses />
        </ProtectedRoute>
      } />
      <Route path="/admin/enrollments" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'INSTRUCTOR']}>
          <Enrollments />
        </ProtectedRoute>
      } />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="empty-state">
            <div className="empty-state-icon">🔒</div>
            <h3>Access Denied</h3>
            <p>You don't have permission to view this page.</p>
          </div>
        </div>
      } />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
