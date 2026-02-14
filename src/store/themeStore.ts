import { create } from 'zustand';
import { StorageService, ThemeMode } from '@core/storage/StorageService';

interface ThemeState {
  mode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: StorageService.getThemeMode(),
  setThemeMode: (mode): void => {
    StorageService.setThemeMode(mode);
    set({ mode });
  },
  toggleThemeMode: (): void => {
    const nextMode: ThemeMode = get().mode === 'dark' ? 'light' : 'dark';
    StorageService.setThemeMode(nextMode);
    set({ mode: nextMode });
  },
}));
