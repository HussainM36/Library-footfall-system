// frontend/src/pages/UserRegistry.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Filter, User, ShieldCheck, ShieldAlert, RefreshCw, Plus, Edit2, Trash2, X } from 'lucide-react';

export const UserRegistry = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(false);
  
  // Dialog modal visibility controllers
  const [showModal, setShowModal] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState(null); // If populated, app is in "Edit Mode"
  
  // Managed Input Buffers
  const [formData, setFormData] = useState({ membership_no: '', full_name: '', department: '', batch: '', designation: 'Student', is_active: true });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Failed to resolve records:', error);
      setUsers([
        { membership_no: '2526029', full_name: 'Nadar Riya Renita', department: 'Computer Engineering', batch: '2026', designation: 'Student', is_active: true },
        { membership_no: '2526045', full_name: 'Shetty Divya', department: 'Information Technology', batch: '2026', designation: 'Student', is_active: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenCreate = () => {
    setCurrentEditUser(null);
    setFormData({ membership_no: '', full_name: '', department: '', batch: '', designation: 'Student', is_active: true });
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setCurrentEditUser(user);
    setFormData({ ...user });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentEditUser) {
        // UPDATE Operation
        await api.put(`/users/${formData.membership_no}`, formData);
        setUsers(users.map(u => u.membership_no === formData.membership_no ? formData : u));
      } else {
        // CREATE Operation
        await api.post('/users', formData);
        setUsers([...users, formData]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("CRUD persistence error:", err);
      // Local fallback simulator updates for testing
      if (currentEditUser) {
        setUsers(users.map(u => u.membership_no === formData.membership_no ? formData : u));
      } else {
        setUsers([...users, formData]);
      }
      setShowModal(false);
    }
  };

  const handleDelete = async (membershipNo) => {
    if (!window.confirm("Are you sure you want to completely delete this student account record?")) return;
    try {
      await api.delete(`/users/${membershipNo}`);
      setUsers(users.filter(u => u.membership_no !== membershipNo));
    } catch (err) {
      setUsers(users.filter(u => u.membership_no !== membershipNo));
    }
  };

  const departments = ['All', ...new Set(users.map(u => u.department).filter(Boolean))];
  const filteredUsers = users.filter(user => {
    return (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || user.membership_no?.includes(searchQuery)) &&
           (selectedDept === 'All' || user.department === selectedDept);
  });

  return (
    <div>
      <div style={styles.headerArea}>
        <div>
          <h1 style={styles.title}>Student Accounts Registry</h1>
          <p style={styles.subtitle}>Execute creation modifications, record deletes, and credential changes.</p>
        </div>
        <button onClick={handleOpenCreate} style={styles.createBtn}>
          <Plus size={16} style={{ marginRight: '6px' }} /> Add New Member
        </button>
      </div>

      <div style={styles.commandRow}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input type="text" placeholder="Search accounts directory..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
        </div>
        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} style={styles.selectInput}>
          {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Member</th>
              <th style={styles.th}>Membership ID</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Batch</th>
              <th style={styles.th}>Access</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Management Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx} style={styles.tr}>
                <td style={styles.td}><strong>{user.full_name}</strong></td>
                <td style={styles.td}><code>#{user.membership_no}</code></td>
                <td style={styles.td}>{user.department}</td>
                <td style={styles.td}>{user.batch}</td>
                <td style={styles.td}>
                  <span style={{ color: user.is_active ? '#065f46' : '#991b1b', backgroundColor: user.is_active ? '#ecfdf5' : '#fef2f2', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>
                    {user.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  <button onClick={() => handleOpenEdit(user)} style={styles.editBtn}><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(user.membership_no)} style={styles.deleteBtn}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dynamic Form Modal Dialog */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBody}>
            <div style={styles.modalHeader}>
              <h3>{currentEditUser ? 'Modify Member Profile' : 'Register New Member Record'}</h3>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Membership Number</label>
                <input type="text" value={formData.membership_no} disabled={!!currentEditUser} onChange={(e) => setFormData({ ...formData, membership_no: e.target.value })} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label>Full Name</label>
                <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label>Department</label>
                <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label>Graduation Year/Batch</label>
                <input type="text" value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label>Terminal Clearance Status</label>
                <select value={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })} style={styles.input}>
                  <option value="true">Active / Cleared</option>
                  <option value="false">Suspended / Flagged</option>
                </select>
              </div>
              <button type="submit" style={styles.submitBtn}>Save Configuration</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  headerArea: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#1e293b' },
  subtitle: { color: '#64748b', fontSize: '14px' },
  createBtn: { display: 'flex', alignItems: 'center', backgroundColor: '#0052cc', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
  commandRow: { display: 'flex', gap: '16px', marginBottom: '20px' },
  searchWrapper: { position: 'relative', flex: 1 },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  searchInput: { width: '100%', padding: '10px 12px 10px 40px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' },
  selectInput: { padding: '10px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', minWidth: '180px' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '14px 16px', fontSize: '13px', color: '#475569', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#334155' },
  editBtn: { border: '1px solid #cbd5e1', background: '#ffffff', padding: '6px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', color: '#0052cc' },
  deleteBtn: { border: '1px solid #fecaca', background: '#ffffff', padding: '6px', borderRadius: '4px', cursor: 'pointer', color: '#dc2626' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalBody: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' },
  submitBtn: { backgroundColor: '#0052cc', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' }
};