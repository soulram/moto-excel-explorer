import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Example for Zustand store
 

type User = { login: string; droit: string; };

type AuthState = {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
  login: async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: username, password }), // <-- CORRECT KEYS!
        credentials: 'include',
      });
      if (!response.ok) return false;
      const data = await response.json();
      if (data && data.user) {
        set({ currentUser: data.user });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },
}));