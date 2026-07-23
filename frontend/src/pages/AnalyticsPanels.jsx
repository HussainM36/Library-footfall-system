// frontend/src/pages/AnalyticsPanels.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BarChart3, Users, Clock, HelpCircle, RefreshCw } from 'lucide-react';

export const AnalyticsPanels = () => {
  const [data, setData] = useState({
    totalToday: 0,
    studentsToday: 0,
    facultyToday: 0,
    peakHour: 'N/A',
    topPurpose: 'N/A',
    hourlyTraffic: [],
    purposeDistribution: []
  });

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(new Date());

  /**
   * Fetch Real-time Analytics Data from Backend
   */
  const fetchAnalytics = useCallback(async (showLoader = false) => {
    if (showLoader) setSyncing(true);
    try {
      const response = await axios.get('/api/analytics/dashboard-summary');
      if (response.data.success) {
        setData(response.data.data);
        setLastSynced(new Date());
      }
    } catch (error) {
      console.error('Error fetching analytics panels data:', error);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  // Initial Data Load
  useEffect(() => {
    fetchAnalytics(true);
  }, [fetchAnalytics]);

  // Dynamic Real-time Auto-Polling (Every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalytics(false); // Silent background polling
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  // Calculate dynamic maximum value for Bar Chart Scaling
  const maxTrafficCount = Math.max(
    ...((data.hourlyTraffic || []).map((t) => t.count)),
    10
  );

  // Calculate dynamic total for Purpose Percentages
  const totalPurposeLogs = (data.purposeDistribution || []).reduce(
    (acc, item) => acc + Number(item.value),
    0
  );

  const stats = [
    {
      title: "Today's Total Footfall",
      value: `${data.totalToday || 0} Members`,
      change: 'Real-time database tally',
      icon: <Users size={20} color="#0052cc" />
    },
    {
      title: 'Student vs Faculty Breakdown',
      value: `${data.studentsToday || 0} / ${data.facultyToday || 0}`,
      change: 'Students / Faculty & Staff',
      icon: <Clock size={20} color="#059669" />
    },
    {
      title: 'Peak Traffic Window',
      value: data.peakHour || 'No logs today',
      change: `Top purpose: ${data.topPurpose || 'N/A'}`,
      icon: <BarChart3 size={20} color="#7c3aed" />
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header with Dynamic Status & Emergency Sync Button */}
      <div style={styles.headerArea}>
        <div>
          <h1 style={styles.title}>System Analytics Console</h1>
          <p style={styles.subtitle}>
            Live auto-sync active • Last updated: {lastSynced.toLocaleTimeString()}
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(true)}
          disabled={syncing}
          style={{
            ...styles.syncBtn,
            opacity: syncing ? 0.7 : 1
          }}
        >
          <RefreshCw
            size={16}
            style={{
              animation: syncing ? 'spin 1s linear infinite' : 'none'
            }}
          />
          {syncing ? 'Syncing...' : 'Sync Database'}
        </button>
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

      {/* Traffic Charts & Data Breakdowns Row */}
      <div style={styles.analyticsLayout}>
        {/* Main Bar Chart */}
        <div style={styles.mainChartCard}>
          <div style={styles.cardHeader}>
            <BarChart3 size={18} style={{ color: '#0052cc' }} />
            <h2 style={styles.cardTitle}>Daily Gate Volume Distribution (Hourly)</h2>
          </div>

          <div style={styles.chartMockArea}>
            {data.hourlyTraffic && data.hourlyTraffic.length > 0 ? (
              data.hourlyTraffic.map((item, i) => {
                const heightPercent = Math.round((item.count / maxTrafficCount) * 100);
                return (
                  <div key={i} style={styles.chartColWrapper}>
                    <span style={styles.barTooltip}>{item.count}</span>
                    <div
                      style={{
                        ...styles.chartBar,
                        height: `${Math.max(heightPercent, 8)}%`
                      }}
                    />
                    <span style={styles.chartAxisLabel}>{item.time}</span>
                  </div>
                );
              })
            ) : (
              <div style={styles.noDataState}>
                No hourly activity logged for today yet.
              </div>
            )}
          </div>
        </div>

        {/* Purpose Distribution Side List */}
        <div style={styles.sidePieCard}>
          <div style={styles.cardHeader}>
            <HelpCircle size={18} style={{ color: '#7c3aed' }} />
            <h2 style={styles.cardTitle}>Purpose of Visit Distribution</h2>
          </div>

          <div style={styles.purposeList}>
            {data.purposeDistribution && data.purposeDistribution.length > 0 ? (
              data.purposeDistribution.map((item, idx) => {
                const count = Number(item.value);
                const percent = totalPurposeLogs > 0 
                  ? Math.round((count / totalPurposeLogs) * 100) 
                  : 0;

                return (
                  <div key={idx} style={styles.purposeItem}>
                    <div style={styles.purposeInfo}>
                      <span style={styles.purposeName}>{item.name}</span>
                      <span style={styles.purposeCount}>
                        {count} logs ({percent}%)
                      </span>
                    </div>
                    <div style={styles.progressBarBg}>
                      <div
                        style={{
                          ...styles.progressBarFill,
                          width: `${percent}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={styles.noDataState}>
                No visit purposes recorded today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '10px 0' },
  headerArea: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '26px', color: '#1e293b', fontWeight: '700', marginBottom: '4px' },
  subtitle: { color: '#64748b', fontSize: '13px' },
  syncBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease'
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' },
  statCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  statTitle: { color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  iconCircle: { width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' },
  statValue: { fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  statChange: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  analyticsLayout: { display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '24px' },
  mainChartCard: { backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px' },
  sidePieCard: { backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '20px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
  cardTitle: { fontSize: '16px', color: '#1e293b', fontWeight: '600' },
  chartMockArea: { height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 10px 0 10px', borderBottom: '2px solid #e2e8f0' },
  chartColWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', position: 'relative' },
  chartBar: { width: '50%', backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0', minHeight: '8px', transition: 'height 0.3s ease' },
  barTooltip: { fontSize: '11px', color: '#3b82f6', fontWeight: '700', marginBottom: '4px' },
  chartAxisLabel: { fontSize: '11px', color: '#64748b', marginTop: '8px', fontWeight: '500' },
  purposeList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  purposeItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  purposeInfo: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '500' },
  purposeName: { color: '#334155' },
  purposeCount: { color: '#64748b' },
  progressBarBg: { height: '8px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#7c3aed', borderRadius: '9999px', transition: 'width 0.3s ease' },
  noDataState: { width: '100%', textAlign: 'center', color: '#94a3b8', fontSize: '13px', margin: 'auto 0' }
};

export default AnalyticsPanels;