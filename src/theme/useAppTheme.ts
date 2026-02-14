import { useMemo } from 'react';
import { colors, darkColors } from './colors';
import { useThemeStore } from '@store/themeStore';

export const useAppTheme = () => {
  const mode = useThemeStore((state) => state.mode);

  return useMemo(() => {
    const isDark = mode === 'dark';

    return {
      mode,
      isDark,
      themeColors: isDark ? darkColors : colors,
      blurType: isDark ? 'dark' : 'light',
    };
  }, [mode]);
};
