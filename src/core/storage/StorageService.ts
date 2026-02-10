/**
 * Storage Service
 *
 * Abstraction layer for data persistence operations
 * Provides type-safe CRUD operations for app data
 */

import { getCanvasKey, getThumbnailKey, storage, StorageKeys } from './MMKVStorage';

/**
 * Canvas Data Interface
 */
export interface CanvasData {
  id: string;
  name: string;
  shapes: unknown[]; // Will be typed properly when we define Shape type
  viewport: {
    x: number;
    y: number;
    scale: number;
  };
  createdAt: number;
  updatedAt: number;
}

/**
 * Canvas Metadata Interface
 */
export interface CanvasMetadata {
  id: string;
  name: string;
  thumbnail?: string;
  shapeCount: number;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  archived: boolean;
}

/**
 * Storage Service Class
 */
export class StorageService {
  /**
   * Canvas Operations
   */

  static saveCanvas(canvasData: CanvasData): void {
    try {
      const key = getCanvasKey(canvasData.id);
      const serialized = JSON.stringify(canvasData);
      storage.set(key, serialized);
    } catch (error) {
      console.error('Failed to save canvas:', error);
      throw new Error('Failed to save canvas data');
    }
  }

  static loadCanvas(canvasId: string): CanvasData | null {
    try {
      const key = getCanvasKey(canvasId);
      const data = storage.getString(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data) as CanvasData;
    } catch (error) {
      console.error('Failed to load canvas:', error);
      return null;
    }
  }

  static deleteCanvas(canvasId: string): void {
    try {
      const canvasKey = getCanvasKey(canvasId);
      const thumbnailKey = getThumbnailKey(canvasId);

      storage.remove(canvasKey);
      storage.remove(thumbnailKey);
    } catch (error) {
      console.error('Failed to delete canvas:', error);
      throw new Error('Failed to delete canvas');
    }
  }

  /**
   * Canvas List Operations
   */

  static saveCanvasList(canvases: CanvasMetadata[]): void {
    try {
      const serialized = JSON.stringify(canvases);
      storage.set(StorageKeys.CANVASES_LIST, serialized);
    } catch (error) {
      console.error('Failed to save canvases list:', error);
      throw new Error('Failed to save canvases list');
    }
  }

  static loadCanvasList(): CanvasMetadata[] {
    try {
      const data = storage.getString(StorageKeys.CANVASES_LIST);

      if (!data) {
        return [];
      }

      return JSON.parse(data) as CanvasMetadata[];
    } catch (error) {
      console.error('Failed to load canvases list:', error);
      return [];
    }
  }

  /**
   * Thumbnail Operations
   */

  static saveThumbnail(canvasId: string, thumbnail: string | null): void {
    try {
      const key = getThumbnailKey(canvasId);
      if (thumbnail === null) {
        storage.remove(key);
        return;
      }
      storage.set(key, thumbnail);
    } catch (error) {
      console.error('Failed to save thumbnail:', error);
    }
  }

  static loadThumbnail(canvasId: string): string | null {
    try {
      const key = getThumbnailKey(canvasId);
      return storage.getString(key) || null;
    } catch (error) {
      console.error('Failed to load thumbnail:', error);
      return null;
    }
  }

  /**
   * App State Operations
   */

  static setActiveCanvasId(canvasId: string | null): void {
    try {
      if (canvasId) {
        storage.set(StorageKeys.ACTIVE_CANVAS_ID, canvasId);
      } else {
        storage.remove(StorageKeys.ACTIVE_CANVAS_ID);
      }
    } catch (error) {
      console.error('Failed to set active canvas ID:', error);
    }
  }

  static getActiveCanvasId(): string | null {
    try {
      return storage.getString(StorageKeys.ACTIVE_CANVAS_ID) || null;
    } catch (error) {
      console.error('Failed to get active canvas ID:', error);
      return null;
    }
  }

  /**
   * App Version & Migration
   */

  static getAppVersion(): number {
    try {
      const version = storage.getNumber(StorageKeys.APP_VERSION);
      return version || 1;
    } catch (error) {
      console.error('Failed to get app version:', error);
      return 1;
    }
  }

  static setAppVersion(version: number): void {
    try {
      storage.set(StorageKeys.APP_VERSION, version);
    } catch (error) {
      console.error('Failed to set app version:', error);
    }
  }

  /**
   * Utility Operations
   */

  static getAllCanvasIds(): string[] {
    try {
      const canvases = this.loadCanvasList();
      return canvases.map((canvas) => canvas.id);
    } catch (error) {
      console.error('Failed to get all canvas IDs:', error);
      return [];
    }
  }

  static getStorageStats(): { canvasCount: number; totalSize: number } {
    try {
      const canvases = this.loadCanvasList();
      const keys = storage.getAllKeys();

      let totalSize = 0;
      keys.forEach((key) => {
        const value = storage.getString(key);
        if (value) {
          totalSize += value.length;
        }
      });

      return {
        canvasCount: canvases.length,
        totalSize,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { canvasCount: 0, totalSize: 0 };
    }
  }

  /**
   * Export/Import Operations
   */

  static exportAllData(): string {
    try {
      const canvases = this.loadCanvasList();
      const allData: Record<string, unknown> = {
        version: this.getAppVersion(),
        exportedAt: Date.now(),
        canvases: [],
      };

      canvases.forEach((metadata) => {
        const canvas = this.loadCanvas(metadata.id);
        const thumbnail = this.loadThumbnail(metadata.id);

        if (canvas) {
          allData.canvases = [
            ...(allData.canvases as unknown[]),
            {
              ...canvas,
              thumbnail,
            },
          ];
        }
      });

      return JSON.stringify(allData);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Failed to export data');
    }
  }

  static importAllData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData) as Record<string, unknown>;

      if (!data.canvases || !Array.isArray(data.canvases)) {
        throw new Error('Invalid import data format');
      }

      const canvasesList: CanvasMetadata[] = [];

      data.canvases.forEach((canvas: unknown) => {
        const canvasObj = canvas as Record<string, unknown>;
        // Validate required fields before saving
        if (
          typeof canvasObj.id === 'string' &&
          typeof canvasObj.name === 'string' &&
          Array.isArray(canvasObj.shapes) &&
          typeof canvasObj.createdAt === 'number' &&
          typeof canvasObj.updatedAt === 'number' &&
          canvasObj.viewport &&
          typeof canvasObj.viewport === 'object'
        ) {
          // Save canvas data
          this.saveCanvas(canvasObj as unknown as CanvasData);

          // Save thumbnail if available
          if (canvasObj.thumbnail && typeof canvasObj.thumbnail === 'string') {
            this.saveThumbnail(canvasObj.id, canvasObj.thumbnail);
          }

          // Add to metadata list
          const shapes = canvasObj.shapes as unknown[];
          const tags = Array.isArray(canvasObj.tags) ? (canvasObj.tags as string[]) : [];
          canvasesList.push({
            id: canvasObj.id,
            name: canvasObj.name,
            shapeCount: shapes.length,
            createdAt: canvasObj.createdAt as number,
            updatedAt: canvasObj.updatedAt as number,
            tags,
            archived: false,
          });
        }
      });

      // Save updated canvases list
      this.saveCanvasList(canvasesList);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Failed to import data');
    }
  }
}
