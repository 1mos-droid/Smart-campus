import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // For API calls

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To check initial auth status
  const [studentId, setStudentId] = useState(null);

  // Base URL for backend API
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedStudentId = localStorage.getItem('studentId');
    if (token && storedStudentId) {
      // Basic check: In a real app, you'd verify the token with the backend
      setIsAuthenticated(true);
      setStudentId(storedStudentId);
    }
    setLoading(false);
  }, []);

  const login = async (id, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { studentId: id, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('studentId', res.data.studentId);
      setIsAuthenticated(true);
      setStudentId(res.data.studentId);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.msg || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (id, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { studentId: id, email, password });
      // After registration, automatically log in the user
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('studentId', res.data.studentId);
      setIsAuthenticated(true);
      setStudentId(res.data.studentId);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.msg || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    setIsAuthenticated(false);
    setStudentId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, studentId, loading, login, register, logout, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
