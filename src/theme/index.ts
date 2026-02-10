/**
 * Theme System
 *
 * Central export for all theme values
 */

import { colors, darkColors } from './colors';
import { layout, spacing } from './spacing';
import {
  textStyles,
  typography as typographyBase,
  h1,
  h2,
  h3,
  body,
  caption,
  button,
} from './typography';
import {
  darkGlassStyles,
  glassBlur,
  glassBorder,
  glassColors,
  glassShadow,
  glassStyles,
} from './glassmorphism';

// Create enhanced typography object with shortcuts
export const typography = {
  ...typographyBase,
  h1,
  h2,
  h3,
  body,
  caption,
  button,
} as const;

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
export { textStyles, h1, h2, h3, body, caption, button } from './typography';
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
