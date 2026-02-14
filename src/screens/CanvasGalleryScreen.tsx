/**
 * Canvas Gallery Screen
 *
 * Main screen showing all canvases
 */

import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CanvasGallery, useCanvasManagerStore } from '@features/canvasManager';
import { useThemeStore } from '@store/themeStore';
import { useAppTheme } from '@/theme';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';

type CanvasGalleryScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CanvasGallery'>;
};

const HeaderTitle: React.FC<{ styles: ReturnType<typeof createStyles> }> = ({ styles }) => (
  <Text style={styles.headerTitle}>My Canvas</Text>
);

const ThemeToggleButton: React.FC<{
  isDark: boolean;
  styles: ReturnType<typeof createStyles>;
  onPress: () => void;
}> = ({ isDark, styles, onPress }) => (
  <Pressable style={styles.themeToggle} onPress={onPress}>
    <Text style={styles.themeToggleText}>{isDark ? '🌙' : '☀️'}</Text>
  </Pressable>
);

const createStyles = (
  themeColors: typeof import('@/theme').colors,
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    headerTitle: {
      fontSize: 22,
      fontWeight: '900',
      letterSpacing: 0.8,
      color: themeColors.text,
      textShadowColor: themeColors.primary,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    themeToggle: {
      marginRight: 12,
      borderWidth: 1,
      borderRadius: 14,
      width: 32,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: themeColors.border,
      backgroundColor: themeColors.surfaceElevated,
    },
    themeToggleText: {
      fontSize: 14,
      color: themeColors.text,
    },
  });

export const CanvasGalleryScreen: React.FC<CanvasGalleryScreenProps> = ({ navigation }) => {
  const loadCanvases = useCanvasManagerStore((state) => state.loadCanvases);
  const toggleThemeMode = useThemeStore((state) => state.toggleThemeMode);
  const { isDark, themeColors } = useAppTheme();
  const styles = useMemo(
    () => createStyles(themeColors as typeof import('@/theme').colors),
    [themeColors],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle styles={styles} />,
      headerRight: () => (
        <ThemeToggleButton isDark={isDark} styles={styles} onPress={toggleThemeMode} />
      ),
    });
  }, [navigation, toggleThemeMode, isDark, styles]);

  // Reload canvases when screen comes into focus (e.g., returning from canvas screen)
  useFocusEffect(
    useCallback(() => {
      loadCanvases();
    }, [loadCanvases]),
  );

  const handleCanvasSelect = (canvasId: string): void => {
    navigation.navigate('Canvas', { canvasId });
  };

  return <CanvasGallery onCanvasSelect={handleCanvasSelect} />;
};
