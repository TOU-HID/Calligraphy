/**
 * App Configuration
 *
 * Central configuration for the Visual Notes App
 */

/**
 * App Constants
 */
export const APP_CONFIG = {
  APP_NAME: 'Visual Notes',
  APP_VERSION: '1.0.0',
  APP_BUILD: 1,
} as const;

/**
 * Canvas Configuration
 */
export const CANVAS_CONFIG = {
  // Default canvas size
  DEFAULT_WIDTH: 2000,
  DEFAULT_HEIGHT: 2000,

  // Viewport
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5.0,
  DEFAULT_ZOOM: 1.0,

  // Performance
  MAX_SHAPES_WARNING: 50,
  MAX_SHAPES_LIMIT: 200,

  // Grid
  GRID_SIZE: 20,
  SHOW_GRID: true,

  // Selection
  SELECTION_HANDLE_SIZE: 12,
  SELECTION_BORDER_WIDTH: 2,

  // Default shape properties
  DEFAULT_SHAPE_COLOR: '#007AFF',
  DEFAULT_SHAPE_OPACITY: 1.0,
  DEFAULT_SHAPE_BORDER_WIDTH: 2,
  DEFAULT_SHAPE_SIZE: 100,
} as const;

/**
 * Gesture Configuration
 */
export const GESTURE_CONFIG = {
  // Pan
  PAN_MIN_DISTANCE: 1,

  // Zoom
  PINCH_MIN_SCALE: 0.1,
  PINCH_MAX_SCALE: 5.0,

  // Tap
  TAP_DURATION_MS: 250,
  DOUBLE_TAP_DURATION_MS: 300,

  // Long Press
  LONG_PRESS_DURATION_MS: 500,
} as const;

/**
 * Performance Configuration
 */
export const PERFORMANCE_CONFIG = {
  // FPS
  TARGET_FPS: 60,
  FPS_SAMPLE_SIZE: 60,

  // Auto-save
  AUTO_SAVE_DEBOUNCE_MS: 500,

  // Thumbnail
  THUMBNAIL_WIDTH: 300,
  THUMBNAIL_HEIGHT: 300,
  THUMBNAIL_CACHE_SIZE: 50,

  // Undo/Redo
  MAX_HISTORY_SIZE: 20,

  // Storage
  MAX_STORAGE_SIZE_MB: 50,
  STORAGE_WARNING_SIZE_MB: 40,
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  // Toolbar
  TOOLBAR_HEIGHT: 60,
  TOOL_ICON_SIZE: 28,

  // Colors
  COLOR_PALETTE: [
    '#FF3B30', // Red
    '#FF9500', // Orange
    '#FFCC00', // Yellow
    '#34C759', // Green
    '#007AFF', // Blue
    '#5856D6', // Purple
    '#FF2D55', // Pink
    '#8E8E93', // Gray
    '#000000', // Black
    '#FFFFFF', // White
  ],

  // Animations
  ANIMATION_DURATION_MS: 200,

  // List
  CANVAS_GRID_COLUMNS: 2,
  CANVAS_LIST_WINDOW_SIZE: 5,
} as const;

/**
 * Development Configuration
 */
export const DEV_CONFIG = {
  ENABLE_PERFORMANCE_MONITOR: __DEV__,
  ENABLE_DEBUG_LOGGING: __DEV__,
  SHOW_DEV_MENU: __DEV__,
} as const;

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: false,
  ENABLE_CLOUD_SYNC: false,
  ENABLE_TEMPLATES: false,
  ENABLE_SHAPE_GROUPING: false,
  ENABLE_LAYERS: false,
  ENABLE_EXPORT_PDF: false,
} as const;
