'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  userId: string;
  email: string;
  name: string;
  role: string;
  phoneNumber?: string;
  profileImage?: string;
  expiresAt: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',  // Important for cookies
        headers: {
          'Cache-Control': 'no-cache',  // Prevent caching
        },
      });
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
