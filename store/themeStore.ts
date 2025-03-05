'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

// Simplified version for troubleshooting
export const useThemeStore = create<ThemeState>()((set, get) => ({
  mode: 'dark',
  isDark: true,
  setMode: (mode) => {
    const isDark = mode === 'dark';
    set({ mode, isDark });
    
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.classList.toggle('light', !isDark);
    }
  },
  toggleMode: () => {
    const currentMode = get().mode;
    const newMode: ThemeMode = currentMode === 'dark' ? 'light' : 'dark';
    get().setMode(newMode);
  }
})); 