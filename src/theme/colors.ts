/**
 * Color Palette
 *
 * Design system colors for the Visual Notes App
 */

export const colors = {
  // Primary Colors
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',

  // Secondary Colors
  secondary: '#5856D6',
  secondaryLight: '#AF52DE',
  secondaryDark: '#3634A3',

  // Neutral Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text Colors
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textInverse: '#FFFFFF',

  // Semantic Colors
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#007AFF',

  // Canvas Colors
  canvasBackground: '#F5F5F5',
  canvasGrid: '#E0E0E0',
  selectionHandle: '#007AFF',
  selectionBorder: '#007AFF',

  // Shape Default Colors
  shapeRed: '#FF3B30',
  shapeOrange: '#FF9500',
  shapeYellow: '#FFCC00',
  shapeGreen: '#34C759',
  shapeBlue: '#007AFF',
  shapePurple: '#5856D6',
  shapePink: '#FF2D55',
  shapeGray: '#8E8E93',
  shapeBlack: '#000000',
  shapeWhite: '#FFFFFF',

  // UI Element Colors
  border: '#C6C6C8',
  borderLight: '#E5E5EA',
  divider: '#C6C6C8',
  overlay: 'rgba(0, 0, 0, 0.4)',
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Interactive States
  activeBackground: '#E5E5EA',
  hoverBackground: '#F2F2F7',
  pressedBackground: '#D1D1D6',
  disabled: '#C7C7CC',
  disabledText: '#C7C7CC',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;

/**
 * Dark mode colors (optional - for future implementation)
 */
export const darkColors = {
  ...colors,
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#48484A',
  border: '#38383A',
  borderLight: '#48484A',
  canvasBackground: '#1C1C1E',
  canvasGrid: '#38383A',
} as const;
