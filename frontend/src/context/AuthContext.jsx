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
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  // Connects directly to your Node.js backend authentication endpoint
  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, admin: adminDetails } = response.data.data;
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(adminDetails));
      
      setAdmin(adminDetails);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Authentication failed';
      return { success: false, message: errorMsg };
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