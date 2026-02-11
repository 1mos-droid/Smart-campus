import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (id, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { userId: id, password });
      localStorage.setItem('token', res.data.token);
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
      return { success: true, role: userRes.data.role };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (id, email, password, name) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { studentId: id, email, password, name });
      localStorage.setItem('token', res.data.token);
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
      return { success: true, role: userRes.data.role };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
