import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

// Create the Context object
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a user session already exists in localStorage when the app boots up
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to parse stored user session:', err);
        // Clean up corrupt session details
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Registers a new user. Calls POST /api/auth/register
  const register = async (username, email, password) => {
    try {
      const response = await API.post('/auth/register', { username, email, password });
      const { token, ...userData } = response.data;

      // Save token and user details to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      const message = error.response?.data?.message || error.response?.data?.errors?.DuplicateUser?.[0] || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  // Logs in an existing user. Calls POST /api/auth/login
  const login = async (usernameOrEmail, password) => {
    try {
      const response = await API.post('/auth/login', { usernameOrEmail, password });
      const { token, ...userData } = response.data;

      // Save token and user details to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Invalid username/email or password.';
      return { success: false, message };
    }
  };

  // Logs out the user. Clears local session details.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
