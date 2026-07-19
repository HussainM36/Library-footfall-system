// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

// Persistent Workspace Subview Mock Components for Phase 10 Structure Verification
const DashboardMock = () => (
  <div style={cardStyle}>
    <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>Dashboard Overview Ledger</h2>
    <p style={{ color: '#64748b' }}>Real-time usage metrics and operational system diagnostics appear here.</p>
  </div>
);

const ScanMock = () => (
  <div style={cardStyle}>
    <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>High-Speed Scanning Desk</h2>
    <p style={{ color: '#64748b' }}>Operational scanner listener interface intercepts check-in entries here.</p>
  </div>
);

const UsersMock = () => (
  <div style={cardStyle}>
    <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>Student Accounts Registry</h2>
    <p style={{ color: '#64748b' }}>Search logs, system records, and directory details here.</p>
  </div>
);

const AnalyticsMock = () => (
  <div style={cardStyle}>
    <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>Analytical Graph Models</h2>
    <p style={{ color: '#64748b' }}>Hourly traffic calculations and reports populate here.</p>
  </div>
);

const cardStyle = { 
  backgroundColor: '#ffffff', 
  padding: '24px', 
  borderRadius: '8px', 
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
  border: '1px solid #e2e8f0' 
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Path (Swapped mock login out for real operational view) */}
          <Route path="/login" element={<Login />} />

          {/* Secure Protected Paths Container Firewall */}
          <Route element={<ProtectedRoute />}>
            {/* Wrapped inside the global Left-Sidebar Layout panel */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardMock />} />
              <Route path="/scan" element={<ScanMock />} />
              <Route path="/users" element={<UsersMock />} />
              <Route path="/analytics" element={<AnalyticsMock />} />
            </Route>
          </Route>

          {/* Fallback Missing URL Traffic Catch */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;