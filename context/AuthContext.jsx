'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '@/utils/axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  loading: true,
  refresh: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //one helper to DRY load logic
  const fetchMe = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/auth/me');
      setUser(data.success ? data.user : null);
    } catch {
      // /auth/me *should not* throw now, but in case of
      // network problems we still fall back to “guest”
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  //initial fetch
  useEffect(() => {
    fetchMe();
  }, []);

  /* ─── expose refresh() to other comps ───── */
  const refresh = fetchMe;

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
