import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  HardDrive, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import api from '../api/axios'; // adjust path as needed for your project

export const DatabaseBackups = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  
  const fileInputRef = useRef(null);

  // Fetch available backups list from backend
  const fetchBackups = async () => {
    setLoading(true);
    try {
      const response = await api.get('/backups');
      setBackups(response.data.backups || []);
    } catch (err) {
      console.error("Error fetching backups:", err);
      showStatus('error', 'Failed to load backup files from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 6000);
  };

  // 1. CREATE SNAPSHOT
  const handleCreateSnapshot = async () => {
    setCreating(true);
    try {
      const response = await api.post('/backups/create');
      showStatus('success', response.data.message || 'Snapshot created successfully!');
      fetchBackups();
    } catch (err) {
      console.error("Backup Creation Error:", err);
      showStatus('error', err.response?.data?.message || 'Failed to create snapshot.');
    } finally {
      setCreating(false);
    }
  };

  // 2. DOWNLOAD SQL FILE (Blob URL trigger prevents Hash Routing bug)
  const handleDownload = async (filename) => {
    try {
      const response = await api.get(`/backups/download/${filename}`, {
        responseType: 'blob'
      });

      // Create downloadable link in browser memory
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download Error:", err);
      showStatus('error', 'Failed to download the .sql backup file.');
    }
  };

  // 3. RESTORE FROM EXISTING SNAPSHOT FILE
  const handleRestoreExisting = async (filename) => {
    if (!window.confirm(`WARNING: Restoring '${filename}' will overwrite all current database tables. Continue?`)) {
      return;
    }

    setRestoring(true);
    try {
      const response = await api.post('/backups/restore', { filename });
      showStatus('success', response.data.message || 'Database restored successfully!');
    } catch (err) {
      console.error("Restore Error:", err);
      showStatus('error', err.response?.data?.message || 'Database restoration failed.');
    } finally {
      setRestoring(false);
    }
  };

  // 4. IMPORT & RESTORE FROM LOCAL COMPUTER (.SQL FILE)
  const handleFileUploadAndRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.sql')) {
      alert('Please select a valid .sql backup file.');
      return;
    }

    if (!window.confirm(`WARNING: Importing '${file.name}' will overwrite your active database. Proceed?`)) {
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('backupFile', file);

    setRestoring(true);
    try {
      const response = await api.post('/backups/restore', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showStatus('success', response.data.message || 'Database imported and restored!');
      fetchBackups();
    } catch (err) {
      console.error("Upload & Restore Error:", err);
      showStatus('error', err.response?.data?.message || 'Failed to import backup file.');
    } finally {
      setRestoring(false);
      event.target.value = '';
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Database Administration Bench</h1>
          <p style={styles.subtitle}>
            Generate cold structural database transaction image logs (`.sql`) to secure account logs against unexpected system dropouts.
          </p>
        </div>
        
        {/* Status Alert Banner */}
        {statusMsg.text && (
          <div style={{
            ...styles.alert,
            backgroundColor: statusMsg.type === 'error' ? '#ffebe9' : '#e6f4ea',
            color: statusMsg.type === 'error' ? '#d9381e' : '#137333',
            borderColor: statusMsg.type === 'error' ? '#f5c2c7' : '#b7e1cd',
          }}>
            {statusMsg.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}
      </div>

      {/* ACTION PANEL */}
      <div style={styles.actionGrid}>
        {/* CREATE SNAPSHOT CARD */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Database size={22} color="#0052cc" />
            <h3 style={styles.cardTitle}>Create New Snapshot</h3>
          </div>
          <p style={styles.cardDesc}>
            Back up all library tables into a downloadable `.sql` checkpoint.
          </p>
          <button 
            onClick={handleCreateSnapshot} 
            disabled={creating || restoring}
            style={styles.primaryBtn}
          >
            <RefreshCw size={16} className={creating ? 'spin' : ''} />
            {creating ? 'Generating Snapshot...' : 'Create Snapshot Point Now'}
          </button>
        </div>

        {/* IMPORT & RESTORE CARD */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <Upload size={22} color="#ea580c" />
            <h3 style={styles.cardTitle}>Import & Restore Backup</h3>
          </div>
          <p style={styles.cardDesc}>
            Upload a saved `.sql` file from your system to restore database state after a crash.
          </p>
          <input 
            type="file" 
            accept=".sql" 
            ref={fileInputRef} 
            onChange={handleFileUploadAndRestore} 
            style={{ display: 'none' }} 
          />
          <button 
            onClick={() => fileInputRef.current && fileInputRef.current.click()} 
            disabled={restoring || creating}
            style={styles.warningBtn}
          >
            <RotateCcw size={16} />
            {restoring ? 'Restoring Database...' : 'Import Backup (.sql)'}
          </button>
        </div>
      </div>

      {/* CHECKPOINT FILES LIST */}
      <div style={styles.listContainer}>
        <div style={styles.listHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={20} color="#334155" />
            <h2 style={styles.listTitle}>Available Checkpoint Files</h2>
          </div>
          <button onClick={fetchBackups} style={styles.iconBtn} title="Refresh List">
            <RefreshCw size={16} />
          </button>
        </div>

        {loading ? (
          <div style={styles.emptyState}>Loading backup files...</div>
        ) : backups.length === 0 ? (
          <div style={styles.emptyState}>No database backups found on server.</div>
        ) : (
          <div style={styles.fileList}>
            {backups.map((item) => (
              <div key={item.filename} style={styles.fileRow}>
                <div>
                  <h4 style={styles.fileName}>{item.filename}</h4>
                  <p style={styles.fileMeta}>
                    Created: {new Date(item.createdAt).toLocaleString()} | Size: {item.size}
                  </p>
                </div>

                <div style={styles.btnGroup}>
                  <button 
                    onClick={() => handleDownload(item.filename)} 
                    style={styles.downloadBtn}
                    type="button"
                  >
                    <Download size={14} /> Download SQL
                  </button>

                  <button 
                    onClick={() => handleRestoreExisting(item.filename)} 
                    disabled={restoring}
                    style={styles.restoreBtn}
                    type="button"
                  >
                    <RotateCcw size={14} /> Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  header: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' },
  subtitle: { fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '650px', lineHeight: '1.5' },
  alert: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: '1px solid', fontSize: '13px', fontWeight: '500' },
  actionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' },
  card: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  cardTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 },
  cardDesc: { fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: '1.4' },
  primaryBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  warningBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px', backgroundColor: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  listContainer: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  listTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 },
  iconBtn: { padding: '6px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', color: '#475569' },
  fileList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  fileRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', flexWrap: 'wrap', gap: '12px' },
  fileName: { fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' },
  fileMeta: { fontSize: '12px', color: '#64748b', margin: 0 },
  btnGroup: { display: 'flex', gap: '8px' },
  downloadBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#0052cc', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  restoreBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#ffffff', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  emptyState: { padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '14px' }
};