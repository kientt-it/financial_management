import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Setup axios with auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      // Verify token by fetching user
      verifyToken();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data);
    } catch (err) {
      setToken(null);
      setUser(null);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, fullName, password, email = '') => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${API_URL}/auth/register`, {
        username,
        fullName,
        password,
        email
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_URL}/auth/me`, updates);
      setUser(res.data);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};
