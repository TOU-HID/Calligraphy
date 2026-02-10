/**
 * Theme System
 *
 * Central export for all theme values
 */

import { colors, darkColors } from './colors';
import { layout, spacing } from './spacing';
import { textStyles, typography } from './typography';
import {
  glassColors,
  glassBlur,
  glassBorder,
  glassShadow,
  glassStyles,
  darkGlassStyles,
} from './glassmorphism';

export const theme = {
  colors,
  darkColors,
  spacing,
  layout,
  typography,
  textStyles,
  glass: {
    colors: glassColors,
    blur: glassBlur,
    border: glassBorder,
    shadow: glassShadow,
    styles: glassStyles,
    darkStyles: darkGlassStyles,
  },
} as const;

export type Theme = typeof theme;

// Re-export for convenience
export { colors, darkColors } from './colors';
export { spacing, layout } from './spacing';
export { typography, textStyles } from './typography';
export {
  glassColors,
  glassBlur,
  glassBorder,
  glassShadow,
  glassStyles,
  darkGlassStyles,
} from './glassmorphism';
export type { ColorKey } from './colors';
export type { SpacingKey } from './spacing';
export type { TextStyleKey } from './typography';
export type { GlassColorKey, GlassBlurKey } from './glassmorphism';
