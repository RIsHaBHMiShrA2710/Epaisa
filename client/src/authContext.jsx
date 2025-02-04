import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user data from local storage when the component initializes
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/auth',
    withCredentials: true,
  });

  // Save user data to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post('/login', { email, password });
      setUser(data.user); // Save user data to state
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post('/register', {
        name,
        email,
        password,
      });
      setUser(data.user); // Save user data to state
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call the logout API endpoint
      await axiosInstance.post('/logout');
      setUser(null); // Clear user data in the context
      localStorage.removeItem('user'); // Clear user data from local storage
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };
  

  // Google Sign-In
  const googleSignIn = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'; // Redirect to Google OAuth
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
