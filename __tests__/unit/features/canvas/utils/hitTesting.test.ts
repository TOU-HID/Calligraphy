import {
  findResizeHandle,
  isPointInShape,
  screenToCanvasPoint,
} from '../../../../../src/features/canvas/utils/hitTesting';
import { Shape } from '../../../../../src/features/canvas/types/shapes';

describe('hitTesting', () => {
  const rect: Shape = {
    id: 'rect1',
    type: 'rectangle',
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    color: 'red',
    opacity: 1,
    borderWidth: 0,
    borderColor: 'black',
    zIndex: 1,
  };

  const circle: Shape = {
    id: 'circle1',
    type: 'circle',
    x: 200,
    y: 200,
    radius: 50,
    color: 'blue',
    opacity: 1,
    borderWidth: 0,
    borderColor: 'black',
    zIndex: 1,
  };

  describe('isPointInShape', () => {
    it('should detect point inside rectangle', () => {
      expect(isPointInShape({ x: 150, y: 150 }, rect)).toBe(true);
    });

    it('should detect point outside rectangle', () => {
      expect(isPointInShape({ x: 50, y: 50 }, rect)).toBe(false);
    });

    it('should detect point inside circle', () => {
      expect(isPointInShape({ x: 200, y: 200 }, circle)).toBe(true);
      expect(isPointInShape({ x: 249, y: 200 }, circle)).toBe(true);
    });

    it('should detect point outside circle', () => {
      expect(isPointInShape({ x: 300, y: 300 }, circle)).toBe(false);
    });
  });

  describe('findResizeHandle', () => {
    it('should find bottom-right handle of rectangle', () => {
      const handle = findResizeHandle({ x: 200, y: 200 }, rect); // Bottom-right corner
      expect(handle).toBe('bottom-right');
    });

    it('should find top-left handle of rectangle', () => {
      const handle = findResizeHandle({ x: 100, y: 100 }, rect);
      expect(handle).toBe('top-left');
    });

    it('should find bottom-right handle of circle (radius)', () => {
      // Circle at 200,200 radius 50. Bounds: 150,150 to 250,250.
      const handle = findResizeHandle({ x: 250, y: 250 }, circle);
      expect(handle).toBe('bottom-right');
    });

    it('should return null if not on handle', () => {
      const handle = findResizeHandle({ x: 150, y: 150 }, rect); // Center
      expect(handle).toBeNull();
    });
  });

  describe('screenToCanvasPoint', () => {
    it('should convert screen point to canvas point with translation and scale', () => {
      const screen = { x: 100, y: 100 };
      const transform = { x: 50, y: 50, scale: 2 };

      // (100 - 50) / 2 = 25
      const expected = { x: 25, y: 25 };
      const result = screenToCanvasPoint(screen, transform);

      expect(result).toEqual(expected);
    });
  });
});
