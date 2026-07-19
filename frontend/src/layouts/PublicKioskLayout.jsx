// frontend/src/layouts/PublicKioskLayout.jsx
import React from 'react';
import { ScanDesk } from '../pages/ScanDesk';
import { LogIn } from 'lucide-react';

export const PublicKioskLayout = ({ onGoToLogin }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui' }}>
      {/* Top Banner Only */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logoCircle}>L</div>
          <div>
            <span style={styles.systemName}>LMS Self-Scan Station</span>
            <span style={styles.badge}>Public Terminal</span>
          </div>
        </div>
        <button onClick={onGoToLogin} style={styles.adminLoginBtn}>
          <LogIn size={16} /> Admin Portal
        </button>
      </header>

      {/* Centered Main Page Body */}
      <main style={styles.mainWrapper}>
        <ScanDesk />
      </main>
    </div>
  );
};

const styles = {
  header: { height: '64px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoCircle: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' },
  systemName: { fontSize: '15px', fontWeight: '600', color: '#1e293b', display: 'block' },
  badge: { fontSize: '11px', color: '#059669', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  adminLoginBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#475569', transition: 'all 0.2s' },
  mainWrapper: { maxWdith: '1200px', margin: '0 auto', padding: '32px' }
};