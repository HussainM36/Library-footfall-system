// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layout & Core Feature Pages Imports
import { AdminLayout } from './layouts/AdminLayout';
import { PublicKioskLayout } from './layouts/PublicKioskLayout';
import { Login } from './pages/Login';
import { ScanDesk } from './pages/ScanDesk';
import { UserRegistry } from './pages/UserRegistry';
import { AnalyticsPanels } from './pages/AnalyticsPanels';
import { DashboardHome } from './pages/DashboardHome';

import './index.css';

// Context helper wrapper to pass auth logging callbacks to the AdminLayout
const AdminLayoutWrapper = () => {
  const { logout } = useAuth(); // Grabs the logout handler from your global AuthContext
  const navigate = useNavigate();

  const handleAdminLogout = async () => {
    try {
      await logout();
      navigate('/scan'); // Cleanly dumps the admin terminal back onto the public self-scan desk
    } catch (error) {
      console.error("Logout failed:", error);
      navigate('/scan'); 
    }
  };

  return <AdminLayout onLogout={handleAdminLogout} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* =========================================================
              🔓 PUBLIC CHANNELS (No authentication credentials needed)
             ========================================================= */}
          
          {/* 1. Public Self-Scanning Desk Kiosk */}
          <Route path="/scan" element={<PublicKioskLayout />} />
          
          {/* 2. Admin Portal Login Gate */}
          <Route path="/login" element={<Login />} />


          {/* =========================================================
              🔒 PROTECTED CHANNELS (Restricted Admin Console)
             ========================================================= */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayoutWrapper />}>
              {/* Main Admin Dashboard Landing Overview */}
              <Route path="/dashboard" element={<DashboardHome />} />
              
              {/* Student Directory Management Workspace */}
              <Route path="/users" element={<UserRegistry />} />
              
              {/* Metrics & Hourly Traffic Calculations Console */}
              <Route path="/analytics" element={<AnalyticsPanels />} />
              
              {/* Optional: Admin can also view the scanning panel inside the layout */}
              <Route path="/admin-scan" element={<ScanDesk />} />
            </Route>
          </Route>


          {/* =========================================================
              🔀 SYSTEM ROUTING FALLBACK
             ========================================================= */}
          {/* Default entry fallback routes directly to the public scan terminal */}
          <Route path="*" element={<Navigate to="/scan" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;