// frontend/src/pages/AnalyticsPanels.jsx
import React from 'react';
import { BarChart3, Users, Clock, HelpCircle } from 'lucide-react';

export const AnalyticsPanels = () => {
  // Analytical metrics aggregate state array mockup parameters matching database distributions
  const stats = [
    { title: 'Current Occupancy Velocity', value: '42 Members', change: '+12% vs last hour', icon: <Users size={20} color="#0052cc" /> },
    { title: 'Average Visit Runtime Duration', value: '1 hr 24 mins', change: '-4 mins from yesterday', icon: <Clock size={20} color="#059669" /> },
    { title: 'Peak Attendance window', value: '4:00 PM - 6:00 PM', change: 'Consistent tracking patterns', icon: <BarChart3 size={20} color="#7c3aed" /> }
  ];

  const purposeDistribution = [
    { name: 'Study / Reading Room', count: 185, percent: '48%' },
    { name: 'Reference Ledger Work', count: 92, percent: '24%' },
    { name: 'Guidance from Librarian', count: 45, percent: '12%' },
    { name: 'Newspaper & Magazines', count: 38, percent: '10%' },
    { name: 'Official Work / Clearances', count: 24, percent: '6%' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.headerArea}>
        <h1 style={styles.title}>System Analytics Console</h1>
        <p style={styles.subtitle}>Track check-in volumes, spatial capacity, and purpose velocity trends.</p>
      </div>

      {/* KPI Stats Scorecard Widgets Row */}
      <div style={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} style={styles.statCard}>
            <div style={styles.statTop}>
              <span style={styles.statTitle}>{stat.title}</span>
              <div style={styles.iconCircle}>{stat.icon}</div>
            </div>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statChange}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Traffic Charts Data Breakdowns layout blocks */}
      <div style={styles.analyticsLayout}>
        <div style={styles.mainChartCard}>
          <div style={styles.cardHeader}>
            <BarChart3 size={18} style={{ color: '#0052cc' }} />
            <h2 style={styles.cardTitle}>Daily Gate Volume Distribution (Hourly)</h2>
          </div>
          <div style={styles.chartMockArea}>
            {/* Custom structural pure CSS/Flex bar visualization chart */}
            {[35, 48, 70, 95, 60, 40, 85, 110, 55, 20].map((height, i) => (
              <div key={i} style={styles.chartColWrapper}>
                <div style={{ ...styles.chartBar, height: `${height}%` }}>
                  <span style={styles.barTooltip}>{height}</span>
                </div>
                <span style={styles.chartAxisLabel}>{9 + i}:00</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.sidePieCard}>
          <div style={styles.cardHeader}>
            <HelpCircle size={18} style={{ color: '#7c3aed' }} />
            <h2 style={styles.cardTitle}>Purpose of Visit Distribution</h2>
          </div>
          <div style={styles.purposeList}>
            {purposeDistribution.map((item, idx) => (
              <div key={idx} style={styles.purposeItem}>
                <div style={styles.purposeInfo}>
                  <span style={styles.purposeName}>{item.name}</span>
                  <span style={styles.purposeCount}>{item.count} logs</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: item.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '10px 0' },
  headerArea: { marginBottom: '24px' },
  title: { fontSize: '26px', color: '#1e293b', fontWeight: '700', marginBottom: '4px' },
  subtitle: { color: '#64748b', fontSize: '14px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' },
  statCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  statTitle: { color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  iconCircle: { width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' },
  statValue: { fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  statChange: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  analyticsLayout: { display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '24px' },
  mainChartCard: { backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px' },
  sidePieCard: { backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
  cardTitle: { fontSize: '16px', color: '#1e293b', fontWeight: '600' },
  chartMockArea: { height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 10px 0 10px', borderBottom: '2px solid #e2e8f0' },
  chartColWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
  chartBar: { width: '60%', backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s', ':hover': { backgroundColor: '#1d4ed8' } },
  chartAxisLabel: { fontSize: '11px', color: '#64748b', marginTop: '8px', fontWeight: '500' },
  purposeList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  purposeItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  purposeInfo: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500' },
  purposeName: { color: '#334155' },
  purposeCount: { color: '#64748b' },
  progressBarBg: { height: '8px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#7c3aed', borderRadius: '9999px' }
};