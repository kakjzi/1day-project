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

    if (storedToken && storedTable) {
      setToken(storedToken);
      setTableNumber(Number(storedTable));
    }
    setLoading(false);
  }, []);

  const login = async (table: number, pin: string) => {
    // Mock login for development (tables 1-10, PIN 1234)
    if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      if (table >= 1 && table <= 10 && pin === '1234') {
        const mockToken = `mock-token-table-${table}`;
        setToken(mockToken);
        setTableNumber(table);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('tableNumber', String(table));
        localStorage.setItem('pin', pin);
      } else {
        throw new Error('Invalid credentials');
      }
    } else {
      // Real API call
      const res = await apiLogin(table, pin);
      setToken(res.token);
      setTableNumber(table);
      localStorage.setItem('token', res.token);
      localStorage.setItem('tableNumber', String(table));
      localStorage.setItem('pin', pin);
    }
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
