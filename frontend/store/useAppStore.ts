import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  language_preference: string;
}

export interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  
  // UI State
  sidebarOpen: boolean;
  currentPage: string;
  
  // Form State
  rsvpSubmitted: boolean;
  guestbookSubmitted: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  setRsvpSubmitted: (submitted: boolean) => void;
  setGuestbookSubmitted: (submitted: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      authLoading: false,
      sidebarOpen: false,
      currentPage: 'home',
      rsvpSubmitted: false,
      guestbookSubmitted: false,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setAuthLoading: (authLoading) => set({ authLoading }),
      
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      
      setCurrentPage: (currentPage) => set({ currentPage }),
      
      setRsvpSubmitted: (rsvpSubmitted) => set({ rsvpSubmitted }),
      
      setGuestbookSubmitted: (guestbookSubmitted) => set({ guestbookSubmitted }),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
        rsvpSubmitted: false,
        guestbookSubmitted: false,
      }),
    }),
    {
      name: 'wedding-app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        rsvpSubmitted: state.rsvpSubmitted,
        guestbookSubmitted: state.guestbookSubmitted,
      }),
    }
  )
);