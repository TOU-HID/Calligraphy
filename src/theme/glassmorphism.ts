/**
 * Glassmorphism Effects
 *
 * Glassmorphism design system for modern, frosted-glass UI elements
 */

/**
 * Glassmorphism color palette with transparency
 */
export const glassColors = {
  // Glass backgrounds with transparency
  glassLight: 'rgba(255, 255, 255, 0.1)',
  glassMedium: 'rgba(255, 255, 255, 0.2)',
  glassStrong: 'rgba(255, 255, 255, 0.3)',
  
  // Dark glass variants
  glassDarkLight: 'rgba(0, 0, 0, 0.1)',
  glassDarkMedium: 'rgba(0, 0, 0, 0.2)',
  glassDarkStrong: 'rgba(0, 0, 0, 0.3)',
  
  // Colored glass overlays
  glassPrimary: 'rgba(0, 122, 255, 0.15)',
  glassSecondary: 'rgba(88, 86, 214, 0.15)',
  glassSuccess: 'rgba(52, 199, 89, 0.15)',
  glassWarning: 'rgba(255, 149, 0, 0.15)',
  glassError: 'rgba(255, 59, 48, 0.15)',
  
  // Gradient backgrounds for glassmorphism
  glassGradient1: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
  glassGradient2: 'linear-gradient(135deg, rgba(0, 122, 255, 0.2), rgba(88, 86, 214, 0.2))',
  glassGradient3: 'linear-gradient(135deg, rgba(52, 199, 89, 0.2), rgba(0, 122, 255, 0.2))',
} as const;

/**
 * Blur intensity levels for glassmorphism
 */
export const glassBlur = {
  subtle: 10,
  medium: 20,
  strong: 30,
  intense: 40,
} as const;

/**
 * Glass border styles
 */
export const glassBorder = {
  color: 'rgba(255, 255, 255, 0.2)',
  colorDark: 'rgba(255, 255, 255, 0.1)',
  width: 1,
  widthBold: 2,
} as const;

/**
 * Glass shadow effects
 */
export const glassShadow = {
  // Soft shadows for depth
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

/**
 * Pre-built glassmorphism styles
 * 
 * Usage:
 * ```tsx
 * <View style={glassStyles.container}>
 *   <BlurView style={glassStyles.blur} blurType="light" blurAmount={20}>
 *     // Your content
 *   </BlurView>
 * </View>
 * ```
 */
export const glassStyles = {
  // Basic glass container
  container: {
    backgroundColor: glassColors.glassMedium,
    borderRadius: 16,
    borderWidth: glassBorder.width,
    borderColor: glassBorder.color,
    overflow: 'hidden' as const,
  },
  
  // Glass card with shadow
  card: {
    backgroundColor: glassColors.glassMedium,
    borderRadius: 16,
    borderWidth: glassBorder.width,
    borderColor: glassBorder.color,
    ...glassShadow.medium,
    overflow: 'hidden' as const,
  },
  
  // Glass button
  button: {
    backgroundColor: glassColors.glassStrong,
    borderRadius: 12,
    borderWidth: glassBorder.width,
    borderColor: glassBorder.color,
    paddingVertical: 12,
    paddingHorizontal: 24,
    ...glassShadow.soft,
  },
  
  // Glass toolbar/header
  toolbar: {
    backgroundColor: glassColors.glassMedium,
    borderBottomWidth: glassBorder.width,
    borderBottomColor: glassBorder.color,
    ...glassShadow.soft,
  },
  
  // Glass modal/overlay
  modal: {
    backgroundColor: glassColors.glassStrong,
    borderRadius: 20,
    borderWidth: glassBorder.width,
    borderColor: glassBorder.color,
    ...glassShadow.strong,
    overflow: 'hidden' as const,
  },
} as const;

/**
 * Dark mode glassmorphism styles
 */
export const darkGlassStyles = {
  container: {
    ...glassStyles.container,
    backgroundColor: glassColors.glassDarkMedium,
    borderColor: glassBorder.colorDark,
  },
  card: {
    ...glassStyles.card,
    backgroundColor: glassColors.glassDarkMedium,
    borderColor: glassBorder.colorDark,
  },
  button: {
    ...glassStyles.button,
    backgroundColor: glassColors.glassDarkStrong,
    borderColor: glassBorder.colorDark,
  },
  toolbar: {
    ...glassStyles.toolbar,
    backgroundColor: glassColors.glassDarkMedium,
    borderBottomColor: glassBorder.colorDark,
  },
  modal: {
    ...glassStyles.modal,
    backgroundColor: glassColors.glassDarkStrong,
    borderColor: glassBorder.colorDark,
  },
} as const;

export type GlassColorKey = keyof typeof glassColors;
export type GlassBlurKey = keyof typeof glassBlur;
