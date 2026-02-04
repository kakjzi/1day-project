'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin, LoginRequest, AuthState } from '@/types';
import { adminLogin } from '@/services/api';

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    admin: null,
    token: null,
    loading: true,
    error: null,
  });

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const adminStr = localStorage.getItem('admin_info');

    if (token && adminStr) {
      try {
        const admin = JSON.parse(adminStr) as Admin;
        setState({
          isAuthenticated: true,
          admin,
          token,
          loading: false,
          error: null,
        });
      } catch {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_info');
        setState((prev) => ({ ...prev, loading: false }));
      }
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (data: LoginRequest): Promise<void> => {
    setState((prev) => ({ ...prev, error: null }));

    try {
      const response = await adminLogin(data);
      
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_info', JSON.stringify(response.admin));

      setState({
        isAuthenticated: true,
        admin: response.admin,
        token: response.token,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '로그인에 실패했습니다',
      }));
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    setState({
      isAuthenticated: false,
      admin: null,
      token: null,
      loading: false,
      error: null,
    });
  };

  const clearError = (): void => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
