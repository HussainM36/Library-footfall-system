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
  // Temporary testing bypass to step right into the UI panels
  const login = async (username, password) => {
    try {
      if (username === 'librarian1') {
        const mockAdminDetails = { username: 'librarian1', id: 2 };
        
        localStorage.setItem('adminToken', 'mock-temporary-jwt-token-string');
        localStorage.setItem('adminData', JSON.stringify(mockAdminDetails));
        
        setAdmin(mockAdminDetails);
        return { success: true };
      } else {
        return { success: false, message: 'Invalid testing admin username.' };
      }
    } catch (error) {
      return { success: false, message: 'Authentication failed' };
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