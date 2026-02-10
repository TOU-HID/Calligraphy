/**
 * Data Migration System
 *
 * Handles data structure changes between app versions
 */

import { type CanvasData, StorageService } from '../StorageService';

/**
 * Migration Interface
 */
export interface Migration {
  version: number;
  description: string;
  migrate: (data: unknown) => unknown;
}

/**
 * Migration Registry
 * Add new migrations here as the app evolves
 */
const migrations: Migration[] = [
  {
    version: 1,
    description: 'Initial version - no migration needed',
    migrate: (data: unknown) => data,
  },
  // Example future migration:
  // {
  //   version: 2,
  //   description: 'Add zIndex to shapes',
  //   migrate: (data: unknown) => {
  //     const canvasData = data as Record<string, unknown>;
  //     if (canvasData.shapes && Array.isArray(canvasData.shapes)) {
  //       canvasData.shapes = canvasData.shapes.map((shape: unknown, index: number) => ({
  //         ...(shape as object),
  //         zIndex: (shape as Record<string, unknown>).zIndex ?? index,
  //       }));
  //     }
  //     return canvasData;
  //   },
  // },
];

/**
 * Migration Service
 */
export class MigrationService {
  private static readonly CURRENT_VERSION = migrations[migrations.length - 1]?.version ?? 1;

  /**
   * Run migrations on startup
   */
  static async runMigrations(): Promise<void> {
    try {
      const currentVersion = StorageService.getAppVersion();

      if (currentVersion === this.CURRENT_VERSION) {
        console.info('App data is up to date, no migrations needed');
        return;
      }

      console.info(`Migrating from version ${currentVersion} to ${this.CURRENT_VERSION}`);

      // Get all canvases
      const canvasesList = StorageService.loadCanvasList();

      // Migrate each canvas
      for (const metadata of canvasesList) {
        await this.migrateCanvas(metadata.id, currentVersion);
      }

      // Update app version
      StorageService.setAppVersion(this.CURRENT_VERSION);

      console.info('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw new Error('Failed to migrate app data');
    }
  }

  /**
   * Migrate a single canvas
   */
  private static async migrateCanvas(canvasId: string, fromVersion: number): Promise<void> {
    try {
      const loadedData = StorageService.loadCanvas(canvasId);

      if (!loadedData) {
        console.warn(`Canvas ${canvasId} not found, skipping migration`);
        return;
      }

      let canvasData: unknown = loadedData;

      // Apply all migrations from fromVersion to current
      for (const migration of migrations) {
        if (migration.version > fromVersion) {
          console.info(`Applying migration v${migration.version}: ${migration.description}`);
          canvasData = migration.migrate(canvasData);
        }
      }

      // Save migrated data
      StorageService.saveCanvas(canvasData as CanvasData);
    } catch (error) {
      console.error(`Failed to migrate canvas ${canvasId}:`, error);
      throw error;
    }
  }

  /**
   * Check if migrations are needed
   */
  static needsMigration(): boolean {
    const currentVersion = StorageService.getAppVersion();
    return currentVersion < this.CURRENT_VERSION;
  }

  /**
   * Get current version
   */
  static getCurrentVersion(): number {
    return this.CURRENT_VERSION;
  }

  /**
   * Get migration history
   */
  static getMigrationHistory(): Migration[] {
    return migrations;
  }
}
