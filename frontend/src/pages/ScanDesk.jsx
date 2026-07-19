// frontend/src/pages/ScanDesk.jsx
import React, { useState } from 'react';
import api from '../api/axios';
import { Scan, ArrowRightLeft, UserCheck, UserX, AlertCircle, Clock } from 'lucide-react';

export const ScanDesk = () => {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '', data: {} }
  const [scanHistory, setScanHistory] = useState([]);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setLoading(true);
    setNotification(null);

    try {
      // Connects directly to your backend operational route built in the early phases
      const response = await api.post('/logs/scan', { studentId: studentId.trim() });
      const { status, log } = response.data.data;

      const newNotification = {
        type: 'success',
        message: status === 'CHECK_IN' 
          ? `Successfully checked IN student: ${studentId}` 
          : `Successfully checked OUT student: ${studentId}`,
        data: { studentId, status, time: new Date().toLocaleTimeString() }
      };

      setNotification(newNotification);
      // Prepend to top of live history log track array list
      setScanHistory((prev) => [newNotification.data, ...prev].slice(0, 10));
      setStudentId(''); // Flush field input for subsequent high-speed scanning actions
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to process student barcode verification.';
      setNotification({
        type: 'error',
        message: errorMsg,
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Upper Title Description Bar */}
      <div style={styles.headerArea}>
        <h1 style={styles.title}>Live Attendance Scanning Desk</h1>
        <p style={styles.subtitle}>Process real-time hardware barcode scanner inputs or manual key entries.</p>
      </div>

      <div style={styles.grid}>
        {/* Left Side: Active Form Action Module */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Scan size={22} style={{ color: '#0052cc' }} />
            <h2 style={styles.cardTitle}>Capture Terminal</h2>
          </div>

          <form onSubmit={handleScanSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Scan Barcode or Type Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Place cursor here & scan card..."
                style={styles.input}
                disabled={loading}
                autoFocus
              />
            </div>

            <button
              type="submit"
              style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
              disabled={loading}
            >
              {loading ? 'Processing Ledger...' : 'Submit Entry Log'}
            </button>
          </form>

          {/* Dynamic Flash Alert Reporting Boxes */}
          {notification && (
            <div style={{
              ...styles.alert,
              ...(notification.type === 'success' ? styles.alertSuccess : styles.alertError)
            }}>
              <div style={styles.alertContent}>
                {notification.type === 'success' ? <UserCheck size={20} /> : <AlertCircle size={20} />}
                <span style={{ fontWeight: '500' }}>{notification.message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Ticker Feed Activity Tracker */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <ArrowRightLeft size={22} style={{ color: '#64748b' }} />
            <h2 style={styles.cardTitle}>Live Station Desk Ticker (Session History)</h2>
          </div>

          <div style={styles.historyContainer}>
            {scanHistory.length === 0 ? (
              <div style={styles.emptyState}>
                <Clock size={36} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                <p>Waiting for scanner inputs on this terminal session...</p>
              </div>
            ) : (
              scanHistory.map((item, index) => (
                <div key={index} style={styles.logRow}>
                  <div style={styles.logLeft}>
                    <span style={{
                      ...styles.badge,
                      ...(item.status === 'CHECK_IN' ? styles.badgeIn : styles.badgeOut)
                    }}>
                      {item.status}
                    </span>
                    <span style={styles.logStudentId}>{item.studentId}</span>
                  </div>
                  <span style={styles.logTime}>{item.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto' },
  headerArea: { marginBottom: '24px' },
  title: { fontSize: '28px', color: '#1e293b', fontWeight: '700', marginBottom: '4px' },
  subtitle: { color: '#64748b', fontSize: '15px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' },
  card: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
  cardTitle: { fontSize: '18px', color: '#1e293b', fontWeight: '600' },
  form: { marginBottom: '20px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#475569', fontSize: '14px', fontWeight: '600', marginBottom: '6px' },
  input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', transition: 'border 0.2s' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#0052cc', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  btnDisabled: { backgroundColor: '#a5c2f1', cursor: 'not-allowed' },
  alert: { padding: '14px', borderRadius: '6px', marginTop: '10px' },
  alertSuccess: { backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
  alertError: { backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
  alertContent: { display: 'flex', alignItems: 'center', gap: '10px' },
  historyContainer: { flex: 1, minHeight: '260px', display: 'flex', flexDirection: 'column' },
  emptyState: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px', textAlign: 'center' },
  logRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' },
  logLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' },
  badgeIn: { backgroundColor: '#d1fae5', color: '#065f46' },
  badgeOut: { backgroundColor: '#fee2e2', color: '#991b1b' },
  logStudentId: { fontWeight: '600', color: '#334155', fontSize: '14px' },
  logTime: { color: '#64748b', fontSize: '13px' }
};