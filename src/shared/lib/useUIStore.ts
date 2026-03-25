import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  accentColor: string;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setAccentColor: (color: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      accentColor: '#FF6B35',

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setAccentColor: (color) => set({ accentColor: color }),
    }),
    {
      name: 'streakr-ui-preferences',
      partialize: (state) => ({
        accentColor: state.accentColor,
      }),
    }
  )
);
