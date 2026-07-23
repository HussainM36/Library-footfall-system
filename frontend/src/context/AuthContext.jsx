// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if admin session exists on reload
  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminData');
    const token = localStorage.getItem('adminToken');
    if (savedAdmin && token) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (e) {
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // 1. PREDEFINED MASTER ADMIN BYPASS (Local Dev & Testing)
    if (
      (cleanUser.toLowerCase() === 'admin' || cleanUser.toLowerCase() === 'librarian1') && 
      cleanPass === 'admin123'
    ) {
      const mockAdminDetails = { username: cleanUser, role: 'Administrator', id: 1 };
      
      localStorage.setItem('adminToken', 'master-admin-jwt-token-string');
      localStorage.setItem('adminData', JSON.stringify(mockAdminDetails));
      
      // Crucial: Instantly update state so ProtectedRoute opens access
      setAdmin(mockAdminDetails);
      return { success: true };
    }

    // 2. LIVE BACKEND API LOGIN
    try {
      const response = await api.post('/auth/login', { username: cleanUser, password: cleanPass });
      
      const { admin: adminData, token } = response.data.data || response.data;
      
      if (token) {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        setAdmin(adminData);
        return { success: true };
      } else {
        return { success: false, message: 'Invalid response from server.' };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Authentication failed. Please check your connection.';
      return { success: false, message };
    }
  };

  // Clears user session completely
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook to hook auth values into any component
export const useAuth = () => useContext(AuthContext);