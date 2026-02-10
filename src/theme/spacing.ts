/**
 * Spacing Scale
 *
 * Consistent spacing values based on 4px grid
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export type SpacingKey = keyof typeof spacing;

/**
 * Common layout dimensions
 */
export const layout = {
  headerHeight: 56,
  toolbarHeight: 60,
  tabBarHeight: 50,
  bottomSheetHeaderHeight: 48,
  thumbnailSize: 120,
  miniMapSize: 150,
  iconSize: {
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 48,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
    round: 9999,
  },
  borderWidth: {
    thin: 1,
    medium: 2,
    thick: 3,
  },
} as const;
