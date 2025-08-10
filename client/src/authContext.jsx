// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
const BACKEND =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '');

const AuthContext = createContext();

axios.defaults.baseURL = BACKEND;

export const AuthProvider = ({ children }) => {
  const qc = useQueryClient();

  // Token & user from localStorage
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  // If token present, attach to axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem('authToken');
    }
  }, [token]);

  // 1) Accept ?token=... one-time
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // 2) Dashboard (requires token)
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useQuery({
    queryKey: ['dashboard', token],
    queryFn: async () => {
      const { data } = await axios.get('/api/users/me/dashboard');
      return data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // 3) Keep user in sync with dashboard (always update)
  useEffect(() => {
    if (dashboardData?.user) {
      setUser(dashboardData.user);
      localStorage.setItem('user', JSON.stringify(dashboardData.user));
    }
  }, [dashboardData]);

  // 4) Auth actions
  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    await qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    await qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const googleSignIn = () => {
    // server should redirect back with ?token=...
    window.location.href = `${BACKEND}/api/auth/google`;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('user');
    await qc.resetQueries(); // clear cached data
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