// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // —————— Local state for token + user ——————
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  // —————— 1) Grab token from URL once ——————
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
      localStorage.setItem('authToken', t);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // —————— 2) Fetch dashboard via React Query ——————
  // Build headers only when token exists
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useQuery({
    queryKey: ['dashboard', token],
    queryFn: () =>
      axios
        .get('https://epaise-backend.onrender.com/api/users/me/dashboard', { headers })
        .then(res => res.data),
    enabled: !!token,             // only run when token is non-null
    staleTime: 1000 * 60 * 5,     // cache fresh for 5 minutes
    refetchOnMount: false,        // don’t refetch on remount
    refetchOnWindowFocus: false,  // don’t refetch on tab focus
  });

  // —————— 3) When dashboard comes in, seed “user” if not set ——————
  useEffect(() => {
    if (dashboardData?.user && !user) {
      setUser(dashboardData.user);
      localStorage.setItem('user', JSON.stringify(dashboardData.user));
    }
  }, [dashboardData, user]);

  // —————— 4) Expose login / register / logout ——————
  const login = async (email, pass) => { 'https://epaise-backend.onrender.com/api/auth/login' };
  const register = async (n, e, p) => { 'https://epaise-backend.onrender.com/api/auth/register' };
  const googleSignIn = () => (window.location.href = 'https://epaise-backend.onrender.com/api/auth/google');
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        dashboardLoading,
        dashboardError,
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
