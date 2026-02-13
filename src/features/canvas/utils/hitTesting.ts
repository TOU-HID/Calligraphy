/**
 * Hit Testing Utilities
 *
 * Functions to detect which shape is at a given point
 */

import { Arrow, Circle, Diamond, Heptagon, Heart, Hexagon, Octagon, Oval, Pentagon, Point, Rectangle, Shape, Star, Triangle } from '../types/shapes';

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
 * Check if a point is inside an oval
 */
const isPointInOval = (point: Point, oval: Oval): boolean => {
  'worklet';
  const rx = oval.rx;
  const ry = oval.ry;
  const h = oval.x + rx;
  const k = oval.y + ry;
  const dx = point.x - h;
  const dy = point.y - k;
  return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
};

/**
 * Check if a point is inside a polygon (used for Star, Hexagon, Diamond)
 */
const isPointInPolygon = (point: Point, vertices: Point[]): boolean => {
  'worklet';
  let inside = false;
  if (!vertices || vertices.length < 3) return false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const vi = vertices[i];
    const vj = vertices[j];
    if (!vi || !vj) continue;
    const xi = vi.x, yi = vi.y;
    const xj = vj.x, yj = vj.y;
    const intersect = ((yi > point.y) !== (yj > point.y)) && 
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

/**
 * Get vertices for Star
 */
const getStarVertices = (star: Star): Point[] => {
  'worklet';
  const vertices: Point[] = [];
  const points = star.points;
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? star.outerRadius : star.innerRadius;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    vertices.push({
      x: star.x + radius * Math.cos(angle),
      y: star.y + radius * Math.sin(angle)
    });
  }
  return vertices;
};

/**
 * Get vertices for Hexagon
 */
const getHexagonVertices = (hex: Hexagon): Point[] => {
  'worklet';
  const vertices: Point[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    vertices.push({
      x: hex.x + hex.size * Math.cos(angle),
      y: hex.y + hex.size * Math.sin(angle)
    });
  }
  return vertices;
};

/**
 * Get vertices for Diamond
 */
const getDiamondVertices = (diamond: Diamond): Point[] => {
  'worklet';
  return [
    { x: diamond.x, y: diamond.y - diamond.height / 2 },
    { x: diamond.x + diamond.width / 2, y: diamond.y },
    { x: diamond.x, y: diamond.y + diamond.height / 2 },
    { x: diamond.x - diamond.width / 2, y: diamond.y }
  ];
};

/**
 * Get vertices for Pentagon
 */
const getPentagonVertices = (pent: Pentagon): Point[] => {
  'worklet';
  const vertices: Point[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    vertices.push({
      x: pent.x + pent.size * Math.cos(angle),
      y: pent.y + pent.size * Math.sin(angle)
    });
  }
  return vertices;
};

/**
 * Get vertices for Octagon
 */
const getOctagonVertices = (oct: Octagon): Point[] => {
  'worklet';
  const vertices: Point[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;
    vertices.push({
      x: oct.x + oct.size * Math.cos(angle),
      y: oct.y + oct.size * Math.sin(angle)
    });
  }
  return vertices;
};

/**
 * Get vertices for Heptagon
 */
const getHeptagonVertices = (hep: Heptagon): Point[] => {
  'worklet';
  const vertices: Point[] = [];
  for (let i = 0; i < 7; i++) {
    const angle = (Math.PI * 2 / 7) * i - Math.PI / 2;
    vertices.push({
      x: hep.x + hep.size * Math.cos(angle),
      y: hep.y + hep.size * Math.sin(angle)
    });
  }
  return vertices;
};

/**
 * Get vertices for Arrow
 */
const getArrowVertices = (arrow: Arrow): Point[] => {
  'worklet';
  const { x, y, width, height, direction } = arrow;
  const headSize = height * 0.4;
  const shaftWidth = width * 0.4;

  if (direction === 'up' || direction === 'down') {
    const sH = height;
    const sW = width;
    const isUp = direction === 'up';
    const startY = isUp ? y : y + sH;
    const endY = isUp ? y + sH : y;
    const headY = isUp ? y + headSize : y + sH - headSize;
    
    return [
      { x: x, y: startY },
      { x: x - sW / 2, y: headY },
      { x: x - shaftWidth / 2, y: headY },
      { x: x - shaftWidth / 2, y: endY },
      { x: x + shaftWidth / 2, y: endY },
      { x: x + shaftWidth / 2, y: headY },
      { x: x + sW / 2, y: headY }
    ];
  } else {
    const sH = height;
    const sW = width;
    const isLeft = direction === 'left';
    const startX = isLeft ? x : x + sW;
    const endX = isLeft ? x + sW : x;
    const headX = isLeft ? x + headSize : x + sW - headSize;
    
    return [
      { x: startX, y: y },
      { x: headX, y: y - sH / 2 },
      { x: headX, y: y - shaftWidth / 2 },
      { x: endX, y: y - shaftWidth / 2 },
      { x: endX, y: y + shaftWidth / 2 },
      { x: headX, y: y + shaftWidth / 2 },
      { x: headX, y: y + sH / 2 }
    ];
  }
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
    case 'oval':
      return isPointInOval(point, shape);
    case 'star':
      return isPointInPolygon(point, getStarVertices(shape));
    case 'hexagon':
      return isPointInPolygon(point, getHexagonVertices(shape));
    case 'diamond':
      return isPointInPolygon(point, getDiamondVertices(shape));
    case 'pentagon':
      return isPointInPolygon(point, getPentagonVertices(shape));
    case 'octagon':
      return isPointInPolygon(point, getOctagonVertices(shape));
    case 'heptagon':
      return isPointInPolygon(point, getHeptagonVertices(shape));
    case 'arrow':
      return isPointInPolygon(point, getArrowVertices(shape));
    case 'heart':
      // Bounding box hit test for heart
      const heart = shape as Heart;
      return (
        point.x >= heart.x - heart.width * 0.6 &&
        point.x <= heart.x + heart.width * 0.6 &&
        point.y >= heart.y &&
        point.y <= heart.y + heart.height
      );
    case 'path':
// ... (omitted paths part, keeping previous logic)
      return shape.points.some((pathPoint) => {
        const dx = point.x - pathPoint.x;
        const dy = point.y - pathPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= 10;
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
  } else if (shape.type === 'oval') {
    // Oval handles (bounding box corners)
    if (Math.hypot(point.x - shape.x, point.y - shape.y) <= HANDLE_RADIUS) return 'top-left';
    if (Math.hypot(point.x - (shape.x + shape.rx * 2), point.y - shape.y) <= HANDLE_RADIUS) return 'top-right';
    if (Math.hypot(point.x - shape.x, point.y - (shape.y + shape.ry * 2)) <= HANDLE_RADIUS) return 'bottom-left';
    if (Math.hypot(point.x - (shape.x + shape.rx * 2), point.y - (shape.y + shape.ry * 2)) <= HANDLE_RADIUS) return 'bottom-right';
  } else if (shape.type === 'star') {
    // Star handles (bounding box of the star)
    if (Math.hypot(point.x - (shape.x - shape.outerRadius), point.y - (shape.y - shape.outerRadius)) <= HANDLE_RADIUS) return 'top-left';
    if (Math.hypot(point.x - (shape.x + shape.outerRadius), point.y - (shape.y - shape.outerRadius)) <= HANDLE_RADIUS) return 'top-right';
    if (Math.hypot(point.x - (shape.x - shape.outerRadius), point.y - (shape.y + shape.outerRadius)) <= HANDLE_RADIUS) return 'bottom-left';
    if (Math.hypot(point.x - (shape.x + shape.outerRadius), point.y - (shape.y + shape.outerRadius)) <= HANDLE_RADIUS) return 'bottom-right';
  } else if (shape.type === 'hexagon' || shape.type === 'pentagon' || shape.type === 'octagon' || shape.type === 'heptagon') {
    // Polygon handles
    const size = (shape as any).size;
    if (Math.hypot(point.x - (shape.x - size), point.y - (shape.y - size)) <= HANDLE_RADIUS) return 'top-left';
    if (Math.hypot(point.x - (shape.x + size), point.y - (shape.y - size)) <= HANDLE_RADIUS) return 'top-right';
    if (Math.hypot(point.x - (shape.x - size), point.y - (shape.y + size)) <= HANDLE_RADIUS) return 'bottom-left';
    if (Math.hypot(point.x - (shape.x + size), point.y - (shape.y + size)) <= HANDLE_RADIUS) return 'bottom-right';
  } else if (shape.type === 'diamond' || shape.type === 'heart' || shape.type === 'arrow') {
    // Bounding box handles for Diamond, Heart, Arrow
    const sW = (shape as any).width;
    const sH = (shape as any).height;
    const sX = shape.type === 'diamond' ? shape.x - sW / 2 : (shape.type === 'heart' ? shape.x - sW * 0.6 : shape.x - sW / 2);
    const sY = shape.type === 'diamond' ? shape.y - sH / 2 : (shape.type === 'heart' ? shape.y : shape.direction === 'up' ? shape.y : (shape.direction === 'down' ? shape.y : shape.y - sH / 2));
    
    // Simplification for Arrow/Heart positioning for hit detection
    if (shape.type === 'arrow') {
        const aX = shape.direction === 'left' || shape.direction === 'right' ? (shape.direction === 'left' ? shape.x : shape.x) : shape.x - sW/2;
        const aY = shape.direction === 'up' || shape.direction === 'down' ? (shape.direction === 'up' ? shape.y : shape.y) : shape.y - sH/2;
        const aW = sW;
        const aH = sH;
        if (Math.hypot(point.x - aX, point.y - aY) <= HANDLE_RADIUS) return 'top-left';
        if (Math.hypot(point.x - (aX + aW), point.y - aY) <= HANDLE_RADIUS) return 'top-right';
        if (Math.hypot(point.x - aX, point.y - (aY + aH)) <= HANDLE_RADIUS) return 'bottom-left';
        if (Math.hypot(point.x - (aX + aW), point.y - (aY + aH)) <= HANDLE_RADIUS) return 'bottom-right';
    } else {
        if (Math.hypot(point.x - sX, point.y - sY) <= HANDLE_RADIUS) return 'top-left';
        if (Math.hypot(point.x - (sX + sW), point.y - sY) <= HANDLE_RADIUS) return 'top-right';
        if (Math.hypot(point.x - sX, point.y - (sY + sH)) <= HANDLE_RADIUS) return 'bottom-left';
        if (Math.hypot(point.x - (sX + sW), point.y - (sY + sH)) <= HANDLE_RADIUS) return 'bottom-right';
    }
  }

  return null;
};
