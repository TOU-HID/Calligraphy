/**
 * MMKV Storage Wrapper
 *
 * Ultra-fast, synchronous storage using MMKV
 * 10x faster than AsyncStorage
 */

import { createMMKV } from 'react-native-mmkv';

/**
 * MMKV Storage Instance
 */
export const storage = createMMKV({
  id: 'calligraphy_app_storage',
  // encryptionKey: undefined, // REMOVED: Passing undefined causes crash on Android
});

/**
 * Storage Keys
 * Centralized storage key management
 */
export const StorageKeys = {
  // Canvas Data
  CANVASES_LIST: 'canvases_list',
  CANVAS_PREFIX: 'canvas_',

  // Thumbnails
  THUMBNAIL_PREFIX: 'thumbnail_',

  // App State
  ACTIVE_CANVAS_ID: 'active_canvas_id',
  APP_VERSION: 'app_version',
  LAST_OPENED: 'last_opened',

  // Settings
  SETTINGS: 'settings',
  THEME_MODE: 'theme_mode',

  // Performance
  PERFORMANCE_METRICS: 'performance_metrics',
} as const;

export type StorageKey = keyof typeof StorageKeys;

/**
 * Storage Helper Functions
 */

/**
 * Get canvas key for specific canvas ID
 */
export const getCanvasKey = (canvasId: string): string => {
  return `${StorageKeys.CANVAS_PREFIX}${canvasId}`;
};

/**
 * Get thumbnail key for specific canvas ID
 */
export const getThumbnailKey = (canvasId: string): string => {
  return `${StorageKeys.THUMBNAIL_PREFIX}${canvasId}`;
};

/**
 * Check if storage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    storage.set('__test__', 'test');
    storage.remove('__test__');
    return true;
  } catch {
    return false;
  }
};

/**
 * Get storage size (approximate)
 */
export const getStorageSize = (): number => {
  try {
    const keys = storage.getAllKeys();
    let totalSize = 0;

    keys.forEach((key: string) => {
      const value = storage.getString(key);
      if (value) {
        totalSize += value.length;
      }
    });

    return totalSize;
  } catch {
    return 0;
  }
};

/**
 * Clear all storage (use with caution!)
 */
export const clearAllStorage = (): void => {
  storage.clearAll();
};
