// ============================================================
// src/context/AuthContext.js
//
// React Context = a way to share data across ALL components
// without passing props through every level.
// Think of it like a "global store" for auth state.
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Step 1: Create the context (like creating an empty box)
const AuthContext = createContext(null);

// Step 2: Create the Provider (the box that holds and shares data)
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true while checking if already logged in

  // On app start, check if a token exists in localStorage
  // If yes, restore the user session automatically
  useEffect(() => {
    const token = localStorage.getItem('propease_token');
    const saved = localStorage.getItem('propease_user');
    if (token && saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  // Called after successful login or signup
  const login = (userData, token) => {
    localStorage.setItem('propease_token', token);
    localStorage.setItem('propease_user',  JSON.stringify(userData));
    setUser(userData);
  };

  // Called when user clicks logout
  const logout = () => {
    localStorage.removeItem('propease_token');
    localStorage.removeItem('propease_user');
    setUser(null);
  };

  // The value object is what all child components can access
  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 3: Custom hook — makes it easy to USE the context in any component
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
