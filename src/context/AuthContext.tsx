'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone_number: string;
  phone_number_normalized?: string;
  role: 'user' | 'agent' | 'admin' | 'super_admin';
  phone_verified: boolean;
  email_verified: boolean;
  kyc_status: string;
  agent_profile_id?: number | null;
  agent_profile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load state from localStorage on mount
    const storedUser = localStorage.getItem('realestway_user');
    const storedToken = localStorage.getItem('realestway_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        // Refresh user details silently in the background
        refreshUser();
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('realestway_user');
        localStorage.removeItem('realestway_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    console.log('Updated user data:', userData);
    setToken(userToken);
    localStorage.setItem('realestway_user', JSON.stringify(userData));
    localStorage.setItem('realestway_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('realestway_user');
    localStorage.removeItem('realestway_token');
  };

  const refreshUser = async () => {
    try {
      const response: any = await ApiService.auth.me();
      // The backend returns { user: { ... } } based on your example
      const userData = response.user || response.data?.user || response.data;
      
      if (userData) {
        setUser(userData);
        console.log('Refreshed user state:', userData);
        localStorage.setItem('realestway_user', JSON.stringify(userData));
      }
    } catch (e) {
      console.error('Failed to refresh user', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    if (typeof window === 'undefined') {
      // During SSR or SSG in Next.js, if not within AuthProvider, avoid crashing the build
      return { 
        user: null, 
        token: null, 
        login: () => {}, 
        logout: () => {}, 
        refreshUser: async () => {}, 
        isLoading: true 
      } as AuthContextType;
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
