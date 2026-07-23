// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { admin, loading } = useAuth();

  // 1. Clean CSS loading indicator spinner
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e9ecef',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 2. Check if admin session exists in React state OR in localStorage
  const hasToken = localStorage.getItem('adminToken');
  const isAuthenticated = Boolean(admin || hasToken);

  // 3. Render restricted routes if authenticated, otherwise bounce to /login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};