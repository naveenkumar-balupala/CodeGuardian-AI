'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, TokenData } from '@/types/auth';
import { AuthService } from '@/services/auth.service';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuthTokens: (data: TokenData) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const response = await AuthService.getMe();
          setUser(response.data);
        } catch {
          // Token invalid or expired, attempt refresh
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const refreshResp = await AuthService.refresh(refreshToken);
              setAuthTokens(refreshResp.data);
            } catch {
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const setAuthTokens = (data: TokenData) => {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    setUser(data.user);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await AuthService.logout(refreshToken);
      } catch {
        // Ignore logout errors
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setAuthTokens,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
