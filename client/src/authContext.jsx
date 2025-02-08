import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true, // Include session cookies
        });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        if (err.response?.status === 401) {
          // 401 means user is not logged in
          console.warn('User is not logged in'); // Log only a warning, not an error
        } else {
          console.error('Failed to fetch user:', err);
        }
        setUser(null);
        localStorage.removeItem('user');
      }
    };
  
    fetchUser();
  }, []);
  
  

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user in localStorage
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'; 
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
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
