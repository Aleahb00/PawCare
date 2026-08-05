import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../api';
import { setTokens, clearTokens } from '../api/client';

const AuthContext = createContext(null);

function currentUserFromToken() {
  const access = localStorage.getItem('pawcare_access');
  if (!access) return null;
  try {
    const decoded = jwtDecode(access);
    if (decoded.exp * 1000 < Date.now()) return null;
    return { id: decoded.user_id, username: decoded.username || null };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(currentUserFromToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.login({ username, password });
      setTokens(data);
      setUser(currentUserFromToken());
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.register(payload);
      return await login(payload.username, payload.password);
    } catch (err) {
      const data = err.response?.data;
      const message = data ? Object.values(data).flat().join(' ') : 'Registration failed.';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  useEffect(() => {
    setUser(currentUserFromToken());
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
