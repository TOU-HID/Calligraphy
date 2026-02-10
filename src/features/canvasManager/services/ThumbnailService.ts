/**
 * ThumbnailService
 *
 * Handles generation and storage of canvas thumbnails using SVG rendering
 */

import { StorageService } from '@core/storage/StorageService';
import type { Shape } from '@features/canvas/types/shapes';

const THUMBNAIL_WIDTH = 320;
const THUMBNAIL_HEIGHT = 240;
const PADDING = 20;

export class ThumbnailService {
  /**
   * Generate thumbnail for a canvas
   * Returns base64 SVG data URI or null if canvas is empty
   */
  static async generateThumbnail(canvasId: string): Promise<string | null> {
    const canvasData = StorageService.loadCanvas(canvasId);
    if (!canvasData || canvasData.shapes.length === 0) {
      return null;
    }

    try {
      // Generate SVG representation of shapes
      const svg = this.generateSVG(canvasData.shapes as Shape[]);
      return svg; // Return raw SVG string instead of base64
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      return null;
    }
  }

  /**
   * Generate SVG markup from shapes
   */
  private static generateSVG(shapes: Shape[]): string {
    // Calculate bounding box for all shapes
    const bounds = this.calculateBounds(shapes);

    // If no bounds (empty canvas), return empty SVG
    if (!bounds) {
      return `<svg width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#2a2a2a"/></svg>`;
    }

    // Calculate scale to fit thumbnail with padding
    const scaleX = (THUMBNAIL_WIDTH - PADDING * 2) / bounds.width;
    const scaleY = (THUMBNAIL_HEIGHT - PADDING * 2) / bounds.height;
    const scale = Math.min(scaleX, scaleY);

    // Calculate offset to center content
    const offsetX = (THUMBNAIL_WIDTH - bounds.width * scale) / 2 - bounds.minX * scale;
    const offsetY = (THUMBNAIL_HEIGHT - bounds.height * scale) / 2 - bounds.minY * scale;

    // Generate shape elements
    const shapeElements = shapes
      .map((shape) => this.shapeToSVG(shape, scale, offsetX, offsetY))
      .join('');

    return `<svg width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2a2a2a"/>
      <g>${shapeElements}</g>
    </svg>`;
  }

  /**
   * Calculate bounding box for all shapes
   */
  private static calculateBounds(shapes: Shape[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  } | null {
    if (shapes.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    shapes.forEach((shape) => {
      switch (shape.type) {
        case 'rectangle':
          minX = Math.min(minX, shape.x);
          minY = Math.min(minY, shape.y);
          maxX = Math.max(maxX, shape.x + shape.width);
          maxY = Math.max(maxY, shape.y + shape.height);
          break;
        case 'circle':
          minX = Math.min(minX, shape.x - shape.radius);
          minY = Math.min(minY, shape.y - shape.radius);
          maxX = Math.max(maxX, shape.x + shape.radius);
          maxY = Math.max(maxY, shape.y + shape.radius);
          break;
        case 'triangle': {
          const x1 = shape.x;
          const y1 = shape.y;
          const x2 = shape.x + shape.width / 2;
          const y2 = shape.y + shape.height;
          const x3 = shape.x + shape.width;
          const y3 = shape.y;
          const points = [x1, y1, x2, y2, x3, y3];
          minX = Math.min(minX, ...points.filter((_, i) => i % 2 === 0));
          minY = Math.min(minY, ...points.filter((_, i) => i % 2 === 1));
          maxX = Math.max(maxX, ...points.filter((_, i) => i % 2 === 0));
          maxY = Math.max(maxY, ...points.filter((_, i) => i % 2 === 1));
          break;
        }
        case 'path': {
          const xs = shape.points.map((p) => p.x);
          const ys = shape.points.map((p) => p.y);
          minX = Math.min(minX, ...xs);
          minY = Math.min(minY, ...ys);
          maxX = Math.max(maxX, ...xs);
          maxY = Math.max(maxY, ...ys);
          break;
        }
      }
    });

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Convert a shape to SVG element
   */
  private static shapeToSVG(shape: Shape, scale: number, offsetX: number, offsetY: number): string {
    const color = shape.color;
    const opacity = shape.opacity;

    switch (shape.type) {
      case 'rectangle': {
        const x = shape.x * scale + offsetX;
        const y = shape.y * scale + offsetY;
        const width = shape.width * scale;
        const height = shape.height * scale;
        return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}" opacity="${opacity}" />`;
      }
      case 'circle': {
        const cx = shape.x * scale + offsetX;
        const cy = shape.y * scale + offsetY;
        const r = shape.radius * scale;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}" />`;
      }
      case 'triangle': {
        const x1 = shape.x * scale + offsetX;
        const y1 = shape.y * scale + offsetY;
        const x2 = (shape.x + shape.width / 2) * scale + offsetX;
        const y2 = (shape.y + shape.height) * scale + offsetY;
        const x3 = (shape.x + shape.width) * scale + offsetX;
        const y3 = shape.y * scale + offsetY;
        const points = `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
        return `<polygon points="${points}" fill="${color}" opacity="${opacity}" />`;
      }
      case 'path': {
        if (shape.points.length < 2) return '';
        const pathData = shape.points
          .map((p, i) => {
            const x = p.x * scale + offsetX;
            const y = p.y * scale + offsetY;
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
          })
          .join(' ');
        return `<path d="${pathData}" stroke="${color}" stroke-width="${
          scale * 2
        }" fill="none" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round" />`;
      }
      default:
        return '';
    }
  }

  /**
   * Get thumbnail for canvas
   */
  static getThumbnail(canvasId: string): string | null {
    return StorageService.loadThumbnail(canvasId);
  }

  /**
   * Generate and save thumbnail for canvas
   */
  static async generateAndSave(canvasId: string): Promise<void> {
    try {
      const thumbnail = await this.generateThumbnail(canvasId);
      if (thumbnail) {
        StorageService.saveThumbnail(canvasId, thumbnail);
        console.info(`Thumbnail generated for canvas ${canvasId}: ${thumbnail.length} chars`);
      } else {
        console.warn(`No thumbnail generated for canvas ${canvasId} (empty canvas)`);
      }
    } catch (error) {
      console.error(`Error generating thumbnail for canvas ${canvasId}:`, error);
    }
  }

  /**
   * Delete thumbnail for canvas
   */
  static deleteThumbnail(canvasId: string): void {
    StorageService.saveThumbnail(canvasId, null);
  }

  /**
   * Regenerate thumbnails for all canvases
   */
  static async regenerateAllThumbnails(): Promise<void> {
    const canvases = StorageService.loadCanvasList();
    for (const canvas of canvases) {
      await this.generateAndSave(canvas.id);
    }
  }
}
