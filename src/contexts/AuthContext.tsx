import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../utils/supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('mmda_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const allowedRoles = [
    'super_admin', 'mmda_admin', 'finance', 'collector', 'auditor',
    'business_owner', 'monitoring_body', 'business_registration_officer', 'regional_admin'
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        setIsLoading(false);
        return false;
      }
      const role = data.user.user_metadata?.role || '';
      if (!allowedRoles.includes(role)) {
        setIsLoading(false);
        return false;
      }
      const userProfile = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || '',
        role,
        district: data.user.user_metadata?.district || '',
      };
      setUser(userProfile);
      localStorage.setItem('mmda_user', JSON.stringify(userProfile));
      setIsLoading(false);
      return true;
    } catch (e) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mmda_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}