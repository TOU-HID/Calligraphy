/**
 * Hit Testing Utilities
 *
 * Functions to detect which shape is at a given point
 */

import { Circle, Point, Rectangle, Shape, Triangle } from '../types/shapes';

/**
 * Check if a point is inside a rectangle
 */
const isPointInRectangle = (point: Point, rect: Rectangle): boolean => {
  'worklet';
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

/**
 * Check if a point is inside a circle
 */
const isPointInCircle = (point: Point, circle: Circle): boolean => {
  'worklet';
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= circle.radius;
};

/**
 * Check if a point is inside a triangle
 * Uses barycentric coordinate system
 */
const isPointInTriangle = (point: Point, triangle: Triangle): boolean => {
  'worklet';
  // Triangle vertices
  const x1 = triangle.x;
  const y1 = triangle.y + triangle.height;
  const x2 = triangle.x + triangle.width / 2;
  const y2 = triangle.y;
  const x3 = triangle.x + triangle.width;
  const y3 = triangle.y + triangle.height;

  // Calculate barycentric coordinates
  const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
  const a = ((y2 - y3) * (point.x - x3) + (x3 - x2) * (point.y - y3)) / denominator;
  const b = ((y3 - y1) * (point.x - x3) + (x1 - x3) * (point.y - y3)) / denominator;
  const c = 1 - a - b;

  return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1;
};

/**
 * Check if a point hits a shape
 */
export const isPointInShape = (point: Point, shape: Shape): boolean => {
  'worklet';
  switch (shape.type) {
    case 'rectangle':
      return isPointInRectangle(point, shape);
    case 'circle':
      return isPointInCircle(point, shape);
    case 'triangle':
      return isPointInTriangle(point, shape);
    case 'path':
      // For paths, check if point is near any segment (with tolerance)
      // This is a simplified check - could be improved
      return shape.points.some((pathPoint) => {
        const dx = point.x - pathPoint.x;
        const dy = point.y - pathPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= 10; // 10px tolerance
      });
    default:
      return false;
  }
};

/**
 * Find the topmost shape at a given point
 * Returns the shape with highest zIndex that contains the point
 */
export const findShapeAtPoint = (point: Point, shapes: Shape[]): Shape | null => {
  'worklet';
  // Filter shapes that contain the point
  const hitShapes = shapes.filter((shape) => isPointInShape(point, shape));

  if (hitShapes.length === 0) {
    return null;
  }

  // Return the shape with the highest zIndex (topmost)
  return hitShapes.reduce((topmost, current) => {
    return current.zIndex > topmost.zIndex ? current : topmost;
  });
};

/**
 * Transform a screen point to canvas coordinates
 * Accounts for pan and zoom transformations
 */
export const screenToCanvasPoint = (
  screenPoint: Point,
  canvasTransform: { x: number; y: number; scale: number },
): Point => {
  'worklet';
  return {
    x: (screenPoint.x - canvasTransform.x) / canvasTransform.scale,
    y: (screenPoint.y - canvasTransform.y) / canvasTransform.scale,
  };
};

export type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;

/**
 * Check if a point hits a resize handle of a shape
 */
export const findResizeHandle = (point: Point, shape: Shape): ResizeHandle => {
  'worklet';
  const HANDLE_RADIUS = 15; // Hit area radius (larger than visual radius)

  if (shape.type === 'rectangle') {
    // Top-Left
    if (Math.hypot(point.x - shape.x, point.y - shape.y) <= HANDLE_RADIUS) return 'top-left';
    // Top-Right
    if (Math.hypot(point.x - (shape.x + shape.width), point.y - shape.y) <= HANDLE_RADIUS) return 'top-right';
    // Bottom-Left
    if (Math.hypot(point.x - shape.x, point.y - (shape.y + shape.height)) <= HANDLE_RADIUS) return 'bottom-left';
    // Bottom-Right
    if (Math.hypot(point.x - (shape.x + shape.width), point.y - (shape.y + shape.height)) <= HANDLE_RADIUS) return 'bottom-right';
  } else if (shape.type === 'circle') {
     // Circle handles based on bounding box corners
     // Top-Left
     if (Math.hypot(point.x - (shape.x - shape.radius), point.y - (shape.y - shape.radius)) <= HANDLE_RADIUS) return 'top-left';
     // Top-Right
     if (Math.hypot(point.x - (shape.x + shape.radius), point.y - (shape.y - shape.radius)) <= HANDLE_RADIUS) return 'top-right';
     // Bottom-Right
     if (Math.hypot(point.x - (shape.x + shape.radius), point.y - (shape.y + shape.radius)) <= HANDLE_RADIUS) return 'bottom-right';
     // Bottom-Left
     if (Math.hypot(point.x - (shape.x - shape.radius), point.y - (shape.y + shape.radius)) <= HANDLE_RADIUS) return 'bottom-left';
  } else if (shape.type === 'triangle') {
    // Triangle handles
    if (Math.hypot(point.x - shape.x, point.y - (shape.y + shape.height)) <= HANDLE_RADIUS) return 'bottom-left';
    if (Math.hypot(point.x - (shape.x + shape.width / 2), point.y - shape.y) <= HANDLE_RADIUS) return 'top-right';
    if (Math.hypot(point.x - (shape.x + shape.width), point.y - (shape.y + shape.height)) <= HANDLE_RADIUS) return 'bottom-right';
  }

  return null;
};
