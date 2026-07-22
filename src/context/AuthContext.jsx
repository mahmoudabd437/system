import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function getSavedJSON(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSavedJSON('school_user'));
  const [tokens, setTokens] = useState(() => ({
    access: localStorage.getItem('school_access_token') || '',
    refresh: localStorage.getItem('school_refresh_token') || '',
  }));

  const login = (payload) => {
    setUser(payload.user);
    setTokens({ access: payload.access, refresh: payload.refresh });
    localStorage.setItem('school_user', JSON.stringify(payload.user));
    localStorage.setItem('school_access_token', payload.access);
    localStorage.setItem('school_refresh_token', payload.refresh);
  };

  const logout = () => {
    setUser(null);
    setTokens({ access: '', refresh: '' });
    localStorage.removeItem('school_user');
    localStorage.removeItem('school_access_token');
    localStorage.removeItem('school_refresh_token');
  };

  const value = useMemo(() => ({ user, tokens, login, logout }), [user, tokens]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
