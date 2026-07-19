// frontend/src/pages/ScanDesk.jsx
import React, { useState } from 'react';
import api from '../api/axios';
import { Scan, ArrowRightLeft, UserCheck, AlertCircle, Clock, User } from 'lucide-react';

export const ScanDesk = () => {
  const [studentId, setStudentId] = useState('');
  const [purposeId, setPurposeId] = useState('6'); // Defaults to 'Study' (ID: 6)
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); 
  const [activeProfile, setActiveProfile] = useState(null); // Holds current scanned student's data
  const [scanHistory, setScanHistory] = useState([]);
  
  // Memory cache to store user profile details locally for smooth check-out retrieval
  const [profileCache, setProfileCache] = useState({});

  // Mapped database purpose records
  const visitPurposes = [
    { id: 1, name: 'Guidance from Librarian' },
    { id: 2, name: 'Reference' },
    { id: 3, name: 'EIL' },
    { id: 4, name: 'Library Clearance' },
    { id: 5, name: 'Newspaper Reading' },
    { id: 6, name: 'Study' },
    { id: 7, name: 'Study-Buddy' },
    { id: 8, name: 'Activity' },
    { id: 9, name: 'Project/Research' },
    { id: 10, name: 'Print/Photocopy' },
    { id: 11, name: 'Official Work' },
    { id: 12, name: 'Book Exhibition' },
    { id: 13, name: 'Question Papers' },
    { id: 14, name: 'Reading' },
    { id: 15, name: 'Other' },
  ];

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setLoading(true);
    setNotification(null);
    const cleanId = studentId.trim();
    const currentTime = new Date().toLocaleTimeString();

    try {
      let response;
      let targetStatus = 'CHECK_IN';

      // 1. Check if the user is already checked in within the live UI layout list
      const openSessionIndex = scanHistory.findIndex(log => log.studentId === cleanId && !log.checkOutTime);
      
      if (openSessionIndex !== -1) {
        response = await api.post('/visits/check-out', { membership_no: cleanId });
        targetStatus = 'CHECK_OUT';
      } else {
        try {
          response = await api.post('/visits/check-in', { 
            membership_no: cleanId,
            purpose_id: parseInt(purposeId, 10)
          });
        } catch (err) {
          if (err.response?.status === 400 || JSON.stringify(err.response?.data)?.toLowerCase().includes('already')) {
            response = await api.post('/visits/check-out', { membership_no: cleanId });
            targetStatus = 'CHECK_OUT';
          } else {
            throw err;
          }
        }
      }

      const serverMessage = response.data?.message || `${targetStatus} recorded successfully.`;
      
      // Extract profile details
      let userProfile = response.data?.data?.user || response.data?.data || null;

      if (targetStatus === 'CHECK_IN' && userProfile) {
        setProfileCache(prev => ({ ...prev, [cleanId]: userProfile }));
      } else if (targetStatus === 'CHECK_OUT' && !userProfile) {
        userProfile = profileCache[cleanId];
      }

      const resolvedName = userProfile?.full_name || userProfile?.fullName || 'Unknown Student';

      // 2. Setup the profile preview state
      if (userProfile) {
        setActiveProfile({
          fullName: resolvedName,
          batch: userProfile.batch || 'N/A',
          department: userProfile.department || 'N/A',
          designation: userProfile.designation || 'Student',
          photoUrl: userProfile.photo_url || userProfile.photoUrl || null,
          statusMessage: serverMessage,
          statusType: targetStatus
        });

        setTimeout(() => { setActiveProfile(null); }, 4000);
      }

      // 3. Update the Session History Ticker
      if (targetStatus === 'CHECK_IN') {
        // Prepend a brand new row structure for standard entry check-in
        const newLog = {
          studentId: cleanId,
          fullName: resolvedName,
          checkInTime: currentTime,
          checkOutTime: null
        };
        setScanHistory(prev => [newLog, ...prev].slice(0, 10));
      } else {
        // If checking out, update the matching student session record's checkOutTime field inline
        setScanHistory(prev => {
          const updated = [...prev];
          const matchIndex = updated.findIndex(log => log.studentId === cleanId && !log.checkOutTime);
          if (matchIndex !== -1) {
            updated[matchIndex] = {
              ...updated[matchIndex],
              checkOutTime: currentTime
            };
          } else {
            // Fallback: If no open check-in session row was captured visually, create a separate log entry
            updated.unshift({
              studentId: cleanId,
              fullName: resolvedName,
              checkInTime: '--:--:--',
              checkOutTime: currentTime
            });
          }
          return updated.slice(0, 10);
        });
      }

      const newNotification = { type: 'success', message: serverMessage };
      setNotification(newNotification);
      setTimeout(() => { setNotification(null); }, 4000);
      setStudentId(''); 

    } catch (error) {
      const validationDetails = error.response?.data?.data;
      let errorMsg = error.response?.data?.message || 'Failed to process student entry.';
      if (Array.isArray(validationDetails) && validationDetails.length > 0) {
        errorMsg = `${errorMsg} (${validationDetails[0].message})`;
      }
      setNotification({ type: 'error', message: errorMsg });
      setActiveProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerArea}>
        <h1 style={styles.title}>Live Attendance Scanning Desk</h1>
        <p style={styles.subtitle}>Select visit intent, execute hardware scans, or enter membership cards.</p>
      </div>

      {/* Profile Overview Banner Box */}
      {activeProfile && (
        <div style={{
          ...styles.profileBanner,
          borderColor: activeProfile.statusType === 'CHECK_IN' ? '#10b981' : '#ef4444'
        }}>
          <div style={styles.profileAvatarArea}>
            {activeProfile.photoUrl ? (
              <img src={activeProfile.photoUrl} alt="Student Profile" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarPlaceholder}><User size={36} style={{ color: '#94a3b8' }} /></div>
            )}
            <span style={{
              ...styles.statusTag,
              backgroundColor: activeProfile.statusType === 'CHECK_IN' ? '#d1fae5' : '#fee2e2',
              color: activeProfile.statusType === 'CHECK_IN' ? '#065f46' : '#991b1b'
            }}>
              {activeProfile.statusType}
            </span>
          </div>
          
          <div style={styles.profileDetailsGrid}>
            <div>
              <label style={styles.profileLabel}>Full Name</label>
              <div style={styles.profileValue}>{activeProfile.fullName}</div>
            </div>
            <div>
              <label style={styles.profileLabel}>Designation / Role</label>
              <div style={styles.profileValue}>{activeProfile.designation}</div>
            </div>
            <div>
              <label style={styles.profileLabel}>Department</label>
              <div style={styles.profileValue}>{activeProfile.department}</div>
            </div>
            <div>
              <label style={styles.profileLabel}>Academic Batch</label>
              <div style={styles.profileValue}>{activeProfile.batch}</div>
            </div>
            <div style={{ gridColumn: 'span 4' }}>
              <label style={styles.profileLabel}>Ledger Status Message</label>
              <div style={{ 
                ...styles.profileValue, 
                color: activeProfile.statusType === 'CHECK_IN' ? '#059669' : '#dc2626', 
                fontWeight: '600' 
              }}>
                {activeProfile.statusMessage}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {/* Left Input Card Module */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Scan size={22} style={{ color: '#0052cc' }} />
            <h2 style={styles.cardTitle}>Terminal Controller</h2>
          </div>

          <form onSubmit={handleScanSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Visit Purpose</label>
              <select 
                value={purposeId} 
                onChange={(e) => setPurposeId(e.target.value)} 
                style={styles.select}
              >
                {visitPurposes.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Scan or Type Membership Number</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Click here & trigger card scanner..."
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
              {loading ? 'Logging Transactions...' : 'Submit Log Entry'}
            </button>
          </form>

          {notification && (
            <div style={{ ...styles.alert, ...(notification.type === 'success' ? styles.alertSuccess : styles.alertError) }}>
              <div style={styles.alertContent}>
                {notification.type === 'success' ? <UserCheck size={20} /> : <AlertCircle size={20} />}
                <span style={{ fontWeight: '500' }}>{notification.message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Session Feed Ticker - Redesigned Layout */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <ArrowRightLeft size={22} style={{ color: '#64748b' }} />
            <h2 style={styles.cardTitle}>Session History Ticker</h2>
          </div>

          <div style={styles.historyContainer}>
            {scanHistory.length === 0 ? (
              <div style={styles.emptyState}>
                <Clock size={36} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                <p>Awaiting inputs on this station terminal loop...</p>
              </div>
            ) : (
              <div style={styles.tickerList}>
                {scanHistory.map((item, index) => (
                  <div key={index} style={styles.historyItemCard}>
                    <div style={styles.itemTopRow}>
                      <span style={styles.historyName}>{item.fullName}</span>
                      <span style={styles.historyId}>#{item.studentId}</span>
                    </div>
                    <div style={styles.itemBottomRow}>
                      <div style={styles.timeLabelPair}>
                        <span style={styles.timeBadgeLabelIn}>IN</span>
                        <span style={styles.timeValue}>{item.checkInTime}</span>
                      </div>
                      <div style={styles.timeLabelPair}>
                        <span style={styles.timeBadgeLabelOut}>OUT</span>
                        <span style={{
                          ...styles.timeValue,
                          color: item.checkOutTime ? '#475569' : '#94a3b8',
                          fontStyle: item.checkOutTime ? 'normal' : 'italic'
                        }}>
                          {item.checkOutTime || 'Active inside...'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
  profileBanner: { display: 'flex', gap: '24px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '6px solid', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px', alignItems: 'center' },
  profileAvatarArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '100px' },
  avatarPlaceholder: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' },
  avatarImg: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' },
  statusTag: { padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'center', minWidth: '85px', display: 'block' },
  profileDetailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 24px', flex: 1 },
  profileLabel: { fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '2px', display: 'block' },
  profileValue: { fontSize: '15px', color: '#1e293b', fontWeight: '500' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' },
  card: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
  cardTitle: { fontSize: '18px', color: '#1e293b', fontWeight: '600' },
  form: { marginBottom: '20px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#475569', fontSize: '14px', fontWeight: '600', marginBottom: '6px' },
  select: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px', backgroundColor: '#ffffff', outline: 'none' },
  input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#0052cc', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  btnDisabled: { backgroundColor: '#a5c2f1', cursor: 'not-allowed' },
  alert: { padding: '14px', borderRadius: '6px', marginTop: '10px' },
  alertSuccess: { backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
  alertError: { backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
  alertContent: { display: 'flex', alignItems: 'center', gap: '10px' },
  
  // Ticker UI Layout elements
  historyContainer: { minHeight: '260px', display: 'flex', flexDirection: 'column' },
  emptyState: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' },
  tickerList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  historyItemCard: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' },
  itemTopRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  historyName: { fontWeight: '600', color: '#1e293b', fontSize: '15px' },
  historyId: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
  itemBottomRow: { display: 'flex', gap: '24px', borderTop: '1px dashed #e2e8f0', paddingTop: '6px', marginTop: '2px' },
  timeLabelPair: { display: 'flex', alignItems: 'center', gap: '8px' },
  timeBadgeLabelIn: { fontSize: '10px', fontWeight: '8px', padding: '2px 6px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '4px', fontWeight: '700' },
  timeBadgeLabelOut: { fontSize: '10px', fontWeight: '8px', padding: '2px 6px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontWeight: '700' },
  timeValue: { fontSize: '13px', color: '#475569', fontWeight: '500' }
};