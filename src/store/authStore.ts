import { create } from 'zustand';
import { MOCK_USER } from '@/lib/constants';
type User = {
  email: string;
  name: string;
};
type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
};
type AuthActions = {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, password: string) => boolean;
  checkAuth: () => void;
};
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (email, password) => {
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      const user = { email: MOCK_USER.email, name: MOCK_USER.name };
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      set({ isLoggedIn: true, user });
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    set({ isLoggedIn: false, user: null });
  },
  signup: (name, email, password) => {
    // In a real app, this would hit an API. Here, we just log in the new user.
    console.log('Signing up with:', { name, email, password });
    const user = { email, name };
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    set({ isLoggedIn: true, user });
    return true;
  },
  checkAuth: () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        set({ isLoggedIn: true, user });
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        set({ isLoggedIn: false, user: null });
      }
    }
  },
}));
// Initialize auth state from localStorage on app load
useAuthStore.getState().checkAuth();