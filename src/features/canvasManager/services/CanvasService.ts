/**
 * Canvas Service
 *
 * Business logic for canvas CRUD operations
 */

import { v4 as uuid } from 'uuid';
import { CanvasData, CanvasMetadata, StorageService } from '@core/storage/StorageService';
import { BatchOperationResult, CanvasFilters, CanvasStats, CanvasTemplate } from '../types';
import { Shape } from '@features/canvas/types/shapes';

export class CanvasService {
  /**
   * Create a new canvas
   */
  static async createCanvas(name: string, template?: CanvasTemplate): Promise<string> {
    const canvasId = uuid();
    const now = Date.now();

    // Create canvas data
    const canvasData: CanvasData = {
      id: canvasId,
      name,
      shapes: template?.defaultShapes || [],
      viewport: { x: 0, y: 0, scale: 1 },
      createdAt: now,
      updatedAt: now,
    };

    // Save canvas
    StorageService.saveCanvas(canvasData);

    // Create metadata
    const metadata: CanvasMetadata = {
      id: canvasId,
      name,
      shapeCount: canvasData.shapes.length,
      createdAt: now,
      updatedAt: now,
      tags: [],
      archived: false,
    };

    // Update canvas list
    const canvases = StorageService.loadCanvasList();
    canvases.push(metadata);
    StorageService.saveCanvasList(canvases);

    return canvasId;
  }

  /**
   * Delete a canvas
   */
  static async deleteCanvas(canvasId: string): Promise<void> {
    // Delete canvas data
    StorageService.deleteCanvas(canvasId);

    // Update canvas list
    const canvases = StorageService.loadCanvasList();
    const filtered = canvases.filter((c) => c.id !== canvasId);
    StorageService.saveCanvasList(filtered);

    // Clear active canvas if deleted
    const activeId = StorageService.getActiveCanvasId();
    if (activeId === canvasId) {
      StorageService.setActiveCanvasId(null);
    }
  }

  /**
   * Rename a canvas
   */
  static async renameCanvas(canvasId: string, newName: string): Promise<void> {
    // Update canvas data
    const canvasData = StorageService.loadCanvas(canvasId);
    if (canvasData) {
      canvasData.name = newName;
      canvasData.updatedAt = Date.now();
      StorageService.saveCanvas(canvasData);
    }

    // Update metadata
    const canvases = StorageService.loadCanvasList();
    const canvas = canvases.find((c) => c.id === canvasId);
    if (canvas) {
      canvas.name = newName;
      canvas.updatedAt = Date.now();
      StorageService.saveCanvasList(canvases);
    }
  }

  /**
   * Duplicate a canvas
   */
  static async duplicateCanvas(sourceId: string): Promise<string> {
    const sourceCanvas = StorageService.loadCanvas(sourceId);
    if (!sourceCanvas) {
      throw new Error('Source canvas not found');
    }

    const newId = uuid();
    const now = Date.now();

    // Create duplicate data with new shape IDs
    const duplicateData: CanvasData = {
      ...sourceCanvas,
      id: newId,
      name: `${sourceCanvas.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
      shapes: (sourceCanvas.shapes as Shape[]).map((shape) => ({
        ...shape,
        id: uuid(), // New IDs for shapes
      })),
    };

    // Save duplicate
    StorageService.saveCanvas(duplicateData);

    // Create metadata
    const metadata: CanvasMetadata = {
      id: newId,
      name: duplicateData.name,
      shapeCount: duplicateData.shapes.length,
      createdAt: now,
      updatedAt: now,
      tags: [],
      archived: false,
    };

    // Update list
    const canvases = StorageService.loadCanvasList();
    canvases.push(metadata);
    StorageService.saveCanvasList(canvases);

    return newId;
  }

  /**
   * Update canvas metadata
   */
  static updateCanvasMetadata(canvasId: string, updates: Partial<CanvasMetadata>): void {
    const canvases = StorageService.loadCanvasList();
    const canvas = canvases.find((c) => c.id === canvasId);

    if (!canvas) return;

    // Apply updates while keeping required fields
    Object.assign(canvas, updates, { updatedAt: Date.now() });

    StorageService.saveCanvasList(canvases);
  }

  /**
   * Archive a canvas (soft delete)
   */
  static archiveCanvas(canvasId: string): void {
    this.updateCanvasMetadata(canvasId, { archived: true });
  }

  /**
   * Restore an archived canvas
   */
  static restoreCanvas(canvasId: string): void {
    this.updateCanvasMetadata(canvasId, { archived: false });
  }

  /**
   * Batch delete canvases
   */
  static async batchDeleteCanvases(canvasIds: string[]): Promise<BatchOperationResult> {
    const result: BatchOperationResult = {
      success: [],
      failed: [],
    };

    for (const id of canvasIds) {
      try {
        await this.deleteCanvas(id);
        result.success.push(id);
      } catch (error) {
        result.failed.push({
          id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }

  /**
   * Batch duplicate canvases
   */
  static async batchDuplicateCanvases(canvasIds: string[]): Promise<BatchOperationResult> {
    const result: BatchOperationResult = {
      success: [],
      failed: [],
    };

    for (const id of canvasIds) {
      try {
        const newId = await this.duplicateCanvas(id);
        result.success.push(newId);
      } catch (error) {
        result.failed.push({
          id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }

  /**
   * Search and filter canvases
   */
  static filterCanvases(canvases: CanvasMetadata[], filters: CanvasFilters): CanvasMetadata[] {
    let filtered = [...canvases];

    // Filter archived
    if (!filters.showArchived) {
      filtered = filtered.filter((c) => !c.archived);
    }

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter((c) => filters.tags.some((tag) => c.tags.includes(tag)));
    }

    // Sort
    switch (filters.sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-newest':
        filtered.sort((a, b) => b.updatedAt - a.updatedAt);
        break;
      case 'date-oldest':
        filtered.sort((a, b) => a.updatedAt - b.updatedAt);
        break;
      case 'shapes-most':
        filtered.sort((a, b) => b.shapeCount - a.shapeCount);
        break;
      case 'shapes-least':
        filtered.sort((a, b) => a.shapeCount - b.shapeCount);
        break;
    }

    return filtered;
  }

  /**
   * Get canvas statistics
   */
  static getCanvasStats(): CanvasStats {
    const canvases = StorageService.loadCanvasList();
    const stats = StorageService.getStorageStats();

    const totalShapes = canvases.reduce((sum, canvas) => sum + canvas.shapeCount, 0);

    return {
      totalCanvases: canvases.length,
      totalShapes,
      averageShapesPerCanvas: canvases.length > 0 ? totalShapes / canvases.length : 0,
      mostRecentUpdate: Math.max(...canvases.map((c) => c.updatedAt), 0),
      storageUsed: stats.totalSize,
    };
  }

  /**
   * Get all tags used across canvases
   */
  static getAllTags(): string[] {
    const canvases = StorageService.loadCanvasList();
    const tagSet = new Set<string>();

    canvases.forEach((canvas) => {
      canvas.tags.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }

  /**
   * Add tag to canvas
   */
  static addTagToCanvas(canvasId: string, tag: string): void {
    const canvases = StorageService.loadCanvasList();
    const canvas = canvases.find((c) => c.id === canvasId);

    if (canvas && !canvas.tags.includes(tag)) {
      canvas.tags.push(tag);
      StorageService.saveCanvasList(canvases);
    }
  }

  /**
   * Remove tag from canvas
   */
  static removeTagFromCanvas(canvasId: string, tag: string): void {
    const canvases = StorageService.loadCanvasList();
    const canvas = canvases.find((c) => c.id === canvasId);

    if (canvas) {
      canvas.tags = canvas.tags.filter((t) => t !== tag);
      StorageService.saveCanvasList(canvases);
    }
  }

  /**
   * Update canvas shape count (called after shapes change)
   */
  static updateCanvasShapeCount(canvasId: string, shapeCount: number): void {
    this.updateCanvasMetadata(canvasId, { shapeCount });
  }
}
