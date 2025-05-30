// AuthContext.js (Token-Based)
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store the token from localStorage or null
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // On mount, check if there's a token in the URL (from Google OAuth)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      // Save token and update state
      setToken(tokenFromUrl);
      localStorage.setItem('authToken', tokenFromUrl);
      // Remove token from URL for cleanliness
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // When token changes, fetch user data using the token
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get('https://epaise-backend.onrender.com/api/users/me/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user); // only store user object
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setUser(null);
        localStorage.removeItem('user');
      }
    };
    fetchUser();
  }, [token]);

  // Login: expect the server to return a token and user info
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post('https://epaise-backend.onrender.com/api/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  // Registration: expect token and user info
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('https://epaise-backend.onrender.com/api/auth/register', { name, email, password });
      return await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In: redirect to your backend's Google OAuth endpoint.
  const googleSignIn = () => {
    window.location.href = 'https://epaise-backend.onrender.com/api/auth/google';
  };

  // Logout: clear token and user data.
  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Optionally, notify the server if needed.
  };

  return (
    <AuthContext.Provider
      value={{
        token,
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
