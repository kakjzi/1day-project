// src/contexts/AuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin } from '@/services/api';

interface AuthContextType {
  token: string | null;
  tableNumber: number | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (tableNumber: number, pin: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedTable = localStorage.getItem('tableNumber');
    const storedPin = localStorage.getItem('pin');

    if (storedToken && storedTable) {
      setToken(storedToken);
      setTableNumber(Number(storedTable));
    } else if (storedTable && storedPin) {
      apiLogin(Number(storedTable), storedPin)
        .then(res => {
          setToken(res.access_token);
          setTableNumber(Number(storedTable));
          localStorage.setItem('token', res.access_token);
        })
        .catch(() => {
          localStorage.removeItem('tableNumber');
          localStorage.removeItem('pin');
        });
    }
    setLoading(false);
  }, []);

  const login = async (table: number, pin: string) => {
    const res = await apiLogin(table, pin);
    setToken(res.access_token);
    setTableNumber(table);
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('tableNumber', String(table));
    localStorage.setItem('pin', pin);
  };

  const logout = () => {
    setToken(null);
    setTableNumber(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tableNumber');
    localStorage.removeItem('pin');
  };

  return (
    <AuthContext.Provider value={{ token, tableNumber, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
