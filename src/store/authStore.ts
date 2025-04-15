import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // TODO: Implement actual login logic
    const mockUser: User = {
      id: '1',
      email,
      name: 'John Doe',
      role: 'admin',
    };
    set({ user: mockUser, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  resetPassword: async (email: string) => {
    // TODO: Implement actual password reset logic
    console.log('Password reset requested for:', email);
  },
}));