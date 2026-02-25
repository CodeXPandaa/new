import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ProjectDetails from './pages/ProjectDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/student-dashboard" 
            element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/teacher-dashboard" 
            element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/project/:id" 
            element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
