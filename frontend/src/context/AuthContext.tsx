import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  vitRegistrationNumber?: string;
  admissionYear?: number;
  degree?: string;
  department?: string;
  category?: string;
}

interface AuthContextType {
  user: StudentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; vitRegistrationNumber?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('edu4loan_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('edu4loan_auth_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get<{ user: StudentUser }>('/auth/me');
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('edu4loan_auth_token');
          setToken(null);
        }
      } catch (err) {
        localStorage.removeItem('edu4loan_auth_token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: StudentUser }>('/auth/login', { email, password });
    const newToken = res.data.token;
    const userData = res.data.user;

    localStorage.setItem('edu4loan_auth_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const register = async (payload: { name: string; email: string; password: string; vitRegistrationNumber?: string }) => {
    const res = await api.post<{ token: string; user: StudentUser }>('/auth/register', payload);
    const newToken = res.data.token;
    const userData = res.data.user;

    localStorage.setItem('edu4loan_auth_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('edu4loan_auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
