// frontend/src/pages/UserRegistry.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

export const UserRegistry = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(false);
  
  // Dialog modal visibility controllers
  const [showModal, setShowModal] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState(null); // If populated, app is in "Edit Mode"
  
  // Managed Input Buffers
  const [formData, setFormData] = useState({ 
    membership_no: '', 
    full_name: '', 
    department: 'B.Ed.', 
    batch: '', 
    designation: 'Sudent', 
    status: 'Active' 
  });

  // Strict Department Dropdown Domain — Now featuring ILL!
  const ALLOWED_DEPARTMENTS = ['B.Ed.', 'D.Ed.', 'ILL'];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Failed to resolve database user records:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  const handleOpenCreate = () => {
    setCurrentEditUser(null);
    setFormData({ membership_no: '', full_name: '', department: 'B.Ed.', batch: '', designation: 'Sudent', status: 'Active' });
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
        await api.put(`/users/${formData.membership_no}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("CRUD database network transaction error:", err);
      setShowModal(false);
    }
  };

  const handleDelete = async (membershipNo) => {
    if (!window.confirm("Are you sure you want to completely delete this user record from the database?")) return;
    try {
      await api.delete(`/users/${membershipNo}`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user record:", err);
    }
  };

  // Bulletproof Normalization Filter matching string keys accurately
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.membership_no?.toString().includes(searchQuery);
    
    if (selectedDept === 'All') return matchesSearch;

    // Normalizes strings by removing spaces/trailing dots so "D.Ed.", "D.Ed", and "d.ed" match identically
    const cleanUserDept = user.department?.replace(/[\s.]/g, '').toLowerCase();
    const cleanSelectedDept = selectedDept.replace(/[\s.]/g, '').toLowerCase();
    
    return matchesSearch && (cleanUserDept === cleanSelectedDept);
  });

  const getDesignationStyle = (role) => {
    const normRole = role?.trim();
    if (normRole === 'Student' || normRole === 'Sudent') {
      return { color: '#0f172a', backgroundColor: '#e2e8f0', label: 'Student' };
    }
    if (normRole === 'Faculty') {
      return { color: '#0052cc', backgroundColor: '#e0eefe', label: 'Faculty' };
    }
    if (normRole === 'Staff') {
      return { color: '#475569', backgroundColor: '#f1f5f9', label: 'Staff' };
    }
    return { color: '#0f172a', backgroundColor: '#e2e8f0', label: role || 'Student' };
  };

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
          <input 
            type="text" 
            placeholder="Search accounts directory..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            style={styles.searchInput} 
          />
        </div>
        
        {/* Dropdown containing B.Ed., D.Ed., and ILL fields */}
        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} style={styles.selectInput}>
          <option value="All">All Departments</option>
          {ALLOWED_DEPARTMENTS.map((d, i) => <option key={i} value={d}>{d}</option>)}
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
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Fetching live database records...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No verified staff, faculty, or student entries match your search criteria.</td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => {
                const badgeInfo = getDesignationStyle(user.designation);
                const isActive = user.status === 'Active' || user.status === 'active';
                
                return (
                  <tr key={idx} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <strong style={{ color: '#1e293b' }}>{user.full_name}</strong>
                        <span style={{ ...styles.roleBadge, color: badgeInfo.color, backgroundColor: badgeInfo.backgroundColor }}>
                          {badgeInfo.label}
                        </span>
                      </div>
                    </td>
                    <td style={styles.td}><code>#{user.membership_no}</code></td>
                    <td style={styles.td}>{user.department}</td>
                    <td style={styles.td}>{user.batch || 'N/A'}</td>
                    <td style={styles.td}>
                      <span style={{ 
                        color: isActive ? '#065f46' : '#991b1b', 
                        backgroundColor: isActive ? '#ecfdf5' : '#fef2f2', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: '600' 
                      }}>
                        {isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button onClick={() => handleOpenEdit(user)} style={styles.editBtn}><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(user.membership_no)} style={styles.deleteBtn}><Trash2 size={13} /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Form Modal Dialog */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBody}>
            <div style={styles.modalHeader}>
              <h3 style={{ fontWeight: '700', color: '#1e293b' }}>{currentEditUser ? 'Modify Account Details' : 'Register New User Entry'}</h3>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Membership Card Number</label>
                <input type="text" value={formData.membership_no} disabled={!!currentEditUser} onChange={(e) => setFormData({ ...formData, membership_no: e.target.value })} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required style={styles.input} />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>System Designation / Role</label>
                <select value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} style={styles.input}>
                  <option value="Sudent">Student</option>
                  <option value="Faculty">Faculty Member</option>
                  <option value="Staff">Administrative Staff</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Department Track</label>
                <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} style={styles.input}>
                  {ALLOWED_DEPARTMENTS.map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Academic Batch / Year (e.g., 2025-27)</label>
                <input type="text" value={formData.batch} placeholder="e.g., 2025-27 or N/A" onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required style={styles.input} />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Terminal Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={styles.input}>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
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
  searchInput: { width: '100%', padding: '10px 12px 10px 40px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' },
  selectInput: { padding: '10px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', minWidth: '180px', fontSize: '14px', cursor: 'pointer' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '14px 16px', fontSize: '13px', color: '#475569', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#334155', verticalAlign: 'middle' },
  roleBadge: { display: 'inline-block', alignSelf: 'flex-start', fontSize: '11px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase', marginTop: '2px' },
  editBtn: { border: '1px solid #cbd5e1', background: '#ffffff', padding: '6px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', color: '#0052cc' },
  deleteBtn: { border: '1px solid #fecaca', background: '#ffffff', padding: '6px', borderRadius: '4px', cursor: 'pointer', color: '#dc2626' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(1px)' },
  modalBody: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#475569' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' },
  submitBtn: { backgroundColor: '#0052cc', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', fontSize: '14px' }
};