// frontend/src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

export const AdminLogin = ({ onLoginSuccess, onBackToScan }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Accepts both predefined admin testing profiles
    if ((cleanUser === 'admin' || cleanUser === 'librarian1') && cleanPass === 'admin123') {
      localStorage.setItem('token', 'master_admin_dev_token_999');
      onLoginSuccess();
    } else {
      setError('Invalid administrative credentials. Use admin / admin123');
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={onBackToScan} style={styles.backBtn}>
        <ArrowLeft size={16} /> Public Scanning Station
      </button>
      
      <div style={styles.card}>
        <div style={styles.iconCircle}><Shield size={24} color="#0052cc" /></div>
        <h2 style={styles.title}>LMS Management Core</h2>
        <p style={styles.subtitle}>Enter credentials to access dashboards & registries.</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Admin Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="e.g., admin or librarian1"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Security Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.btn}>Authorize Session</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', position: 'relative' },
  backBtn: { position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: '#475569', fontWeight: '500' },
  card: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center' },
  iconCircle: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e0eefe', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  title: { fontSize: '22px', color: '#1e293b', fontWeight: '700', marginBottom: '4px' },
  subtitle: { color: '#64748b', fontSize: '13px', marginBottom: '24px' },
  form: { textAlign: 'left' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#475569', fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' },
  error: { color: '#dc2626', fontSize: '13px', fontWeight: '500', marginBottom: '12px' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#0052cc', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }
};