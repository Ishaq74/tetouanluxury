
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '../types';

// Simulating Better Auth Session Shape
interface Session {
    user: {
        id: string;
        email: string;
        name: string;
        image?: string;
        role: UserRole;
    };
    expiresAt: string;
}

interface UserContextType {
  role: UserRole;
  user: Session['user'] | null;
  session: Session | null;
  isLoading: boolean;
  login: (role: UserRole, userData?: any) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage (simulating auth cookie check)
  useEffect(() => {
      const storedSession = localStorage.getItem('better_auth_session');
      if (storedSession) {
          try {
              const parsed = JSON.parse(storedSession) as Session;
              const expires = new Date(parsed.expiresAt);
              if (expires > new Date()) {
                  setSession(parsed);
              } else {
                  console.warn("Session expired");
                  localStorage.removeItem('better_auth_session');
              }
          } catch (e) {
              console.error("Invalid session", e);
          }
      }
      setIsLoading(false);
  }, []);

  const login = async (newRole: UserRole, userData: any = {}) => {
      setIsLoading(true);
      // Simulate API Call delay
      await new Promise(r => setTimeout(r, 500));

      const newSession: Session = {
          user: {
              id: `usr_${Date.now()}`,
              email: userData.email || `user@tetouanvillas.ma`,
              name: userData.name || 'User',
              role: newRole,
              image: `https://ui-avatars.com/api/?name=${userData.name || 'User'}`
          },
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h expiry
      };

      setSession(newSession);
      localStorage.setItem('better_auth_session', JSON.stringify(newSession));
      setIsLoading(false);
  };

  const logout = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 300));
      setSession(null);
      localStorage.removeItem('better_auth_session');
      setIsLoading(false);
      window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ 
        role: session?.user.role || UserRole.GUEST, 
        user: session?.user || null, 
        session, 
        isLoading, 
        login, 
        logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
