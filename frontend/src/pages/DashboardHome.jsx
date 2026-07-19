// frontend/src/pages/DashboardHome.jsx
import React from 'react';
import { BookOpen, Layout, ShieldCheck, Activity } from 'lucide-react';

export const DashboardHome = ({ setActiveTab }) => {
  return (
    <div style={styles.container}>
      <div style={styles.welcomeBanner}>
        <h1 style={styles.bannerTitle}>Welcome to LMS Gatekeeper Administration Panel</h1>
        <p style={styles.bannerSubtitle}>Real-time campus occupancy verification, gate access logs, and core resource monitoring.</p>
      </div>

      <div style={styles.featureGrid}>
        <div style={styles.featureCard} onClick={() => setActiveTab('live-desk')}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#e0eefe', color: '#2563eb' }}>
            <Activity size={24} />
          </div>
          <h3 style={styles.featureTitle}>Live Scanning Terminal</h3>
          <p style={styles.featureDesc}>Launch the barcode processing panel loop to register automated checking entries and exits.</p>
        </div>

        <div style={styles.featureCard} onClick={() => setActiveTab('users')}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#e0f2fe', color: '#0369a1' }}>
            <BookOpen size={24} />
          </div>
          <h3 style={styles.featureTitle}>User Registry Logs</h3>
          <p style={styles.featureDesc}>Filter card records, monitor designation ranks, and modify active terminal suspension states.</p>
        </div>

        <div style={styles.featureCard} onClick={() => setActiveTab('analytics')}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#f3e8ff', color: '#7e3af2' }}>
            <Layout size={24} />
          </div>
          <h3 style={styles.featureTitle}>Analytics Console</h3>
          <p style={styles.featureDesc}>Evaluate volume thresholds, traffic heatmaps, and institutional intent distributions.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '10px 0' },
  welcomeBanner: { padding: '32px', backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '8px', marginBottom: '32px' },
  bannerTitle: { fontSize: '28px', fontWeight: '700', marginBottom: '8px' },
  bannerSubtitle: { color: '#94a3b8', fontSize: '15px' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' },
  featureCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s', ':hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' } },
  iconContainer: { width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  featureTitle: { fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' },
  featureDesc: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' }
};