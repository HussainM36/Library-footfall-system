// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all security credential inputs.');
      return;
    }

    setLoading(true);

    try {
      // Delegate ALL authentication logic to AuthContext
      const result = await login(username, password);
      setLoading(false);

      if (result && result.success) {
        // Navigate replace prevents back-button bouncing
        navigate('/dashboard', { replace: true });
      } else {
        setError(result?.message || 'Invalid administrative credentials.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during login. Please try again.');
    }
  };

  const handleQuickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Library Tracking System</h2>
        <p style={styles.subtitle}>Sign in to access the administrator panel</p>
        
        {error && <div style={styles.errorAlert}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Admin Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            disabled={loading}
          >
            {loading ? 'Authenticating Secures...' : 'Login As Administrator'}
          </button>
        </form>

        <div style={styles.quickFillContainer}>
          <p style={styles.quickFillTitle}>Quick Login Testing Accounts:</p>
          <div style={styles.quickFillButtons}>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('admin', 'admin123')} 
              style={styles.quickBtn}
            >
              admin / admin123
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickLogin('librarian1', 'admin123')} 
              style={styles.quickBtn}
            >
              librarian1 / admin123
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' },
  card: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' },
  title: { color: '#1a1a1a', fontSize: '26px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '24px', textAlign: 'center' },
  errorAlert: { backgroundColor: '#ffebe9', color: '#d9381e', padding: '12px', borderRadius: '6px', fontSize: '14px', marginBottom: '20px', border: '1px solid rgba(217, 56, 30, 0.2)', fontWeight: '500' },
  inputGroup: { marginBottom: '18px' },
  label: { display: 'block', color: '#444', fontSize: '14px', fontWeight: '600', marginBottom: '6px' },
  input: { width: '100%', padding: '12px', border: '1px solid #cccccc', borderRadius: '6px', fontSize: '15px', outline: 'none' },
  button: { width: '100%', padding: '14px', backgroundColor: '#0052cc', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  buttonDisabled: { backgroundColor: '#a5c2f1', cursor: 'not-allowed' },
  quickFillContainer: { marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center' },
  quickFillTitle: { fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px' },
  quickFillButtons: { display: 'flex', gap: '8px', justifyContent: 'center' },
  quickBtn: { backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', color: '#334155', fontWeight: '500' }
};