// ============================================================
// src/App.js
//
// The ROOT of the React app.
// React Router lives here — it decides which page to show
// based on the current URL.
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/global.css';

// Pages
import LoginPage     from './pages/auth/LoginPage';
import SignupPage    from './pages/auth/SignupPage';
import OwnerDashboard  from './pages/owner/OwnerDashboard';
import TenantDashboard from './pages/tenant/TenantDashboard';

// -------------------------------------------------------
// ProtectedRoute: Only lets logged-in users through.
// If not logged in, redirects to /login.
// If logged in but wrong role, redirects to their dashboard.
// -------------------------------------------------------
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ color: '#e8ecf8', padding: 40 }}>Loading...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'owner' ? '/owner' : '/tenant'} replace />;
  }

  return children;
};

// -------------------------------------------------------
// Main App with all routes
// -------------------------------------------------------
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"  element={!user ? <LoginPage />  : <Navigate to={user.role === 'owner' ? '/owner' : '/tenant'} />} />
      <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to={user.role === 'owner' ? '/owner' : '/tenant'} />} />

      {/* Owner-only dashboard */}
      <Route path="/owner/*" element={
        <ProtectedRoute role="owner">
          <OwnerDashboard />
        </ProtectedRoute>
      } />

      {/* Tenant-only dashboard */}
      <Route path="/tenant/*" element={
        <ProtectedRoute role="tenant">
          <TenantDashboard />
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={
        user
          ? <Navigate to={user.role === 'owner' ? '/owner' : '/tenant'} />
          : <Navigate to="/login" />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
