import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  login: string;
  droit: string;
};

type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

// Create the context
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // You might want to load the user from localStorage or an API in a real app
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy use
export const useAuth = () => useContext(AuthContext);