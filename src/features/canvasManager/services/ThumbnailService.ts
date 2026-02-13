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
      return `<svg width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffffff"/></svg>`;
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
      <rect width="100%" height="100%" fill="#ffffff"/>
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
          const y1 = shape.y + shape.height;
          const x2 = shape.x + shape.width / 2;
          const y2 = shape.y;
          const x3 = shape.x + shape.width;
          const y3 = shape.y + shape.height;
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
        case 'oval':
          minX = Math.min(minX, shape.x);
          minY = Math.min(minY, shape.y);
          maxX = Math.max(maxX, shape.x + shape.rx * 2);
          maxY = Math.max(maxY, shape.y + shape.ry * 2);
          break;
        case 'star':
          minX = Math.min(minX, shape.x - shape.outerRadius);
          minY = Math.min(minY, shape.y - shape.outerRadius);
          maxX = Math.max(maxX, shape.x + shape.outerRadius);
          maxY = Math.max(maxY, shape.y + shape.outerRadius);
          break;
        case 'hexagon':
          minX = Math.min(minX, shape.x - shape.size);
          minY = Math.min(minY, shape.y - shape.size);
          maxX = Math.max(maxX, shape.x + shape.size);
          maxY = Math.max(maxY, shape.y + shape.size);
          break;
        case 'diamond':
          minX = Math.min(minX, shape.x - shape.width / 2);
          minY = Math.min(minY, shape.y - shape.height / 2);
          maxX = Math.max(maxX, shape.x + shape.width / 2);
          maxY = Math.max(maxY, shape.y + shape.height / 2);
          break;
        case 'pentagon':
        case 'octagon':
        case 'heptagon':
          minX = Math.min(minX, shape.x - (shape as any).size);
          minY = Math.min(minY, shape.y - (shape as any).size);
          maxX = Math.max(maxX, shape.x + (shape as any).size);
          maxY = Math.max(maxY, shape.y + (shape as any).size);
          break;
        case 'heart':
          minX = Math.min(minX, shape.x - (shape as any).width * 0.6);
          minY = Math.min(minY, shape.y);
          maxX = Math.max(maxX, shape.x + (shape as any).width * 0.6);
          maxY = Math.max(maxY, shape.y + (shape as any).height);
          break;
        case 'arrow':
          if ((shape as any).direction === 'up' || (shape as any).direction === 'down') {
            minX = Math.min(minX, shape.x - (shape as any).width / 2);
            minY = Math.min(minY, shape.y);
            maxX = Math.max(maxX, shape.x + (shape as any).width / 2);
            maxY = Math.max(maxY, shape.y + (shape as any).height);
          } else {
            minX = Math.min(minX, shape.x);
            minY = Math.min(minY, shape.y - (shape as any).height / 2);
            maxX = Math.max(maxX, shape.x + (shape as any).width);
            maxY = Math.max(maxY, shape.y + (shape as any).height / 2);
          }
          break;
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
        const y1 = (shape.y + shape.height) * scale + offsetY;
        const x2 = (shape.x + shape.width / 2) * scale + offsetX;
        const y2 = shape.y * scale + offsetY;
        const x3 = (shape.x + shape.width) * scale + offsetX;
        const y3 = (shape.y + shape.height) * scale + offsetY;
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
      case 'oval': {
        const cx = (shape.x + shape.rx) * scale + offsetX;
        const cy = (shape.y + shape.ry) * scale + offsetY;
        const rx = shape.rx * scale;
        const ry = shape.ry * scale;
        return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}" />`;
      }
      case 'star': {
        const vertices = [];
        for (let i = 0; i < shape.points * 2; i++) {
          const radius = i % 2 === 0 ? shape.outerRadius : shape.innerRadius;
          const angle = (Math.PI / shape.points) * i - Math.PI / 2;
          vertices.push(`${(shape.x + radius * Math.cos(angle)) * scale + offsetX},${(shape.y + radius * Math.sin(angle)) * scale + offsetY}`);
        }
        return `<polygon points="${vertices.join(' ')}" fill="${color}" opacity="${opacity}" />`;
      }
      case 'hexagon': {
        const vertices = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 2;
          vertices.push(`${(shape.x + shape.size * Math.cos(angle)) * scale + offsetX},${(shape.y + shape.size * Math.sin(angle)) * scale + offsetY}`);
        }
        return `<polygon points="${vertices.join(' ')}" fill="${color}" opacity="${opacity}" />`;
      }
      case 'diamond': {
        const x1 = shape.x * scale + offsetX;
        const y1 = (shape.y - shape.height / 2) * scale + offsetY;
        const x2 = (shape.x + shape.width / 2) * scale + offsetX;
        const y2 = shape.y * scale + offsetY;
        const x3 = shape.x * scale + offsetX;
        const y3 = (shape.y + shape.height / 2) * scale + offsetY;
        const x4 = (shape.x - shape.width / 2) * scale + offsetX;
        const y4 = shape.y * scale + offsetY;
        return `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}" fill="${color}" opacity="${opacity}" />`;
      }
      case 'pentagon':
      case 'octagon':
      case 'heptagon': {
        const sides = shape.type === 'pentagon' ? 5 : shape.type === 'octagon' ? 8 : 7;
        const vertices = [];
        for (let i = 0; i < sides; i++) {
          const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
          vertices.push(`${(shape.x + (shape as any).size * Math.cos(angle)) * scale + offsetX},${(shape.y + (shape as any).size * Math.sin(angle)) * scale + offsetY}`);
        }
        return `<polygon points="${vertices.join(' ')}" fill="${color}" opacity="${opacity}" />`;
      }
      case 'heart': {
        const hX = shape.x;
        const hY = shape.y;
        const hW = (shape as any).width;
        const hH = (shape as any).height;
        
        // Scale and offset coordinates
        const sX = (x: number) => x * scale + offsetX;
        const sY = (y: number) => y * scale + offsetY;
        
        const pathData = `
          M ${sX(hX)} ${sY(hY + hH * 0.3)}
          C ${sX(hX)} ${sY(hY)} ${sX(hX - hW * 0.6)} ${sY(hY)} ${sX(hX - hW * 0.6)} ${sY(hY + hH * 0.3)}
          C ${sX(hX - hW * 0.6)} ${sY(hY + hH * 0.6)} ${sX(hX)} ${sY(hY + hH * 0.9)} ${sX(hX)} ${sY(hY + hH)}
          C ${sX(hX)} ${sY(hY + hH * 0.9)} ${sX(hX + hW * 0.6)} ${sY(hY + hH * 0.6)} ${sX(hX + hW * 0.6)} ${sY(hY + hH * 0.3)}
          C ${sX(hX + hW * 0.6)} ${sY(hY)} ${sX(hX)} ${sY(hY)} ${sX(hX)} ${sY(hY + hH * 0.3)}
        `;
        return `<path d="${pathData}" fill="${color}" opacity="${opacity}" />`;
      }
      case 'arrow': {
        const aX = shape.x;
        const aY = shape.y;
        const aW = (shape as any).width;
        const aH = (shape as any).height;
        const headSize = aH * 0.4;
        const shaftWidth = aW * 0.4;
        
        const sX = (x: number) => x * scale + offsetX;
        const sY = (y: number) => y * scale + offsetY;
        
        let vertices = [];
        if ((shape as any).direction === 'up' || (shape as any).direction === 'down') {
          const isUp = (shape as any).direction === 'up';
          const startY = isUp ? aY : aY + aH;
          const endY = isUp ? aY + aH : aY;
          const headY = isUp ? aY + headSize : aY + aH - headSize;
          
          vertices = [
            `${sX(aX)},${sY(startY)}`,
            `${sX(aX - aW / 2)},${sY(headY)}`,
            `${sX(aX - shaftWidth / 2)},${sY(headY)}`,
            `${sX(aX - shaftWidth / 2)},${sY(endY)}`,
            `${sX(aX + shaftWidth / 2)},${sY(endY)}`,
            `${sX(aX + shaftWidth / 2)},${sY(headY)}`,
            `${sX(aX + aW / 2)},${sY(headY)}`
          ];
        } else {
          const isLeft = (shape as any).direction === 'left';
          const startX = isLeft ? aX : aX + aW;
          const endX = isLeft ? aX + aW : aX;
          const headX = isLeft ? aX + headSize : aX + aW - headSize;
          
          vertices = [
            `${sX(startX)},${sY(aY)}`,
            `${sX(headX)},${sY(aY - aH / 2)}`,
            `${sX(headX)},${sY(aY - shaftWidth / 2)}`,
            `${sX(endX)},${sY(aY - shaftWidth / 2)}`,
            `${sX(endX)},${sY(aY + shaftWidth / 2)}`,
            `${sX(headX)},${sY(aY + shaftWidth / 2)}`,
            `${sX(headX)},${sY(aY + aH / 2)}`
          ];
        }
        return `<polygon points="${vertices.join(' ')}" fill="${color}" opacity="${opacity}" />`;
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
