// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

// Styled Login Screen Mock Blueprint
const MockLogin = () => (
  <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
    <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', width: '380px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '16px', color: '#1a1a1a', fontSize: '24px', fontWeight: '600' }}>Admin Login Portal</h2>
      <p style={{ color: '#666666', fontSize: '14px', lineHeight: '1.5' }}>(Phase 10 Form UI will be coded right inside this card block)</p>
    </div>
  </div>
);

// Styled Private Dashboard Canvas Mock Blueprint
const MockDashboard = () => (
  <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h1 style={{ color: '#1a1a1a', marginBottom: '12px', fontSize: '28px' }}>Protected Dashboard</h1>
      <p style={{ color: '#2e7d32', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ✓ Phase 9 Security Verification Passed Successfully.
      </p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Path */}
          <Route path="/login" element={<MockLogin />} />

          {/* Secure Protected Paths Container Wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<MockDashboard />} />
          </Route>

          {/* Fallback Missing URL Traffic Catch */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;