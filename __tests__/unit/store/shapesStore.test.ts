/**
 * Shapes Store Tests
 */

import { useShapesStore } from '../../../src/store/shapesStore';
import { Circle, Rectangle } from '../../../src/features/canvas/types/shapes';

describe('useShapesStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useShapesStore.setState({
      shapes: [],
      selectedShapeId: null,
      canvasId: 'default-canvas',
      canvasName: 'Untitled Drawing',
      isDrawingMode: false,
      drawingConfig: {
        color: '#000000',
        strokeWidth: 3,
      },
    });
  });

  describe('initial state', () => {
    it('should have empty shapes array', () => {
      const store = useShapesStore.getState();
      expect(store.shapes).toEqual([]);
    });

    it('should have no selected shape', () => {
      const store = useShapesStore.getState();
      expect(store.selectedShapeId).toBeNull();
    });

    it('should not be in drawing mode', () => {
      const store = useShapesStore.getState();
      expect(store.isDrawingMode).toBe(false);
    });
  });

  describe('addShape', () => {
    it('should add a shape to the store', () => {
      const shape: Rectangle = {
        id: '1',
        type: 'rectangle',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        color: '#000',
        opacity: 1,
        borderWidth: 2,
        borderColor: '#000',
        zIndex: 0,
      };

      useShapesStore.getState().addShape(shape);

      const shapes = useShapesStore.getState().shapes;
      expect(shapes).toHaveLength(1);
      expect(shapes[0]).toEqual(shape);
    });

    it('should add multiple shapes', () => {
      const shape1: Rectangle = {
        id: '1',
        type: 'rectangle',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        color: '#000',
        opacity: 1,
        borderWidth: 2,
        borderColor: '#000',
        zIndex: 0,
      };

      const shape2: Circle = {
        id: '2',
        type: 'circle',
        x: 200,
        y: 200,
        radius: 50,
        color: '#f00',
        opacity: 1,
        borderWidth: 2,
        borderColor: '#000',
        zIndex: 1,
      };

      useShapesStore.getState().addShape(shape1);
      useShapesStore.getState().addShape(shape2);

      const shapes = useShapesStore.getState().shapes;
      expect(shapes).toHaveLength(2);
    });
  });

  describe('updateShape', () => {
    const initialShape: Rectangle = {
      id: '1',
      type: 'rectangle',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      color: '#000',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#000',
      zIndex: 0,
    };

    beforeEach(() => {
      useShapesStore.getState().addShape(initialShape);
    });

    it('should update shape properties', () => {
      useShapesStore.getState().updateShape('1', { x: 50, y: 50 });

      const shape = useShapesStore.getState().shapes[0];
      expect(shape).toBeDefined();
      expect(shape!.x).toBe(50);
      expect(shape!.y).toBe(50);
    });

    it('should not mutate original shape', () => {
      const originalShape = useShapesStore.getState().shapes[0];

      useShapesStore.getState().updateShape('1', { x: 50 });

      // Original reference should be different
      const updatedShape = useShapesStore.getState().shapes[0];
      expect(updatedShape).not.toBe(originalShape);
    });

    it('should handle function updates', () => {
      useShapesStore.getState().updateShape('1', (prev) => ({
        x: prev.x + 10,
        y: prev.y + 20,
      }));

      const shape = useShapesStore.getState().shapes[0];
      expect(shape).toBeDefined();
      expect(shape!.x).toBe(10);
      expect(shape!.y).toBe(20);
    });

    it('should not update non-existent shape', () => {
      useShapesStore.getState().updateShape('non-existent', { x: 100 });

      const shapes = useShapesStore.getState().shapes;
      expect(shapes).toHaveLength(1);
      expect(shapes[0]?.x).toBe(0); // Unchanged
    });
  });

  describe('deleteShape', () => {
    beforeEach(() => {
      useShapesStore.getState().addShape({
        id: '1',
        type: 'rectangle',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        color: '#000',
        opacity: 1,
        borderWidth: 2,
        borderColor: '#000',
        zIndex: 0,
      });
    });

    it('should remove shape from store', () => {
      useShapesStore.getState().deleteShape('1');

      const shapes = useShapesStore.getState().shapes;
      expect(shapes).toHaveLength(0);
    });

    it('should deselect shape if it was selected', () => {
      useShapesStore.getState().selectShape('1');
      useShapesStore.getState().deleteShape('1');

      const selectedId = useShapesStore.getState().selectedShapeId;
      expect(selectedId).toBeNull();
    });

    it('should not affect selection if different shape is selected', () => {
      useShapesStore.getState().addShape({
        id: '2',
        type: 'circle',
        x: 0,
        y: 0,
        radius: 50,
        color: '#000',
        opacity: 1,
        borderWidth: 2,
        borderColor: '#000',
        zIndex: 0,
      });
      useShapesStore.getState().selectShape('2');
      useShapesStore.getState().deleteShape('1');

      const selectedId = useShapesStore.getState().selectedShapeId;
      expect(selectedId).toBe('2');
    });
  });

  describe('selectShape', () => {
    it('should select a shape', () => {
      useShapesStore.getState().selectShape('1');

      const selectedId = useShapesStore.getState().selectedShapeId;
      expect(selectedId).toBe('1');
    });

    it('should deselect by passing null', () => {
      useShapesStore.getState().selectShape('1');
      useShapesStore.getState().selectShape(null);

      const selectedId = useShapesStore.getState().selectedShapeId;
      expect(selectedId).toBeNull();
    });
  });

  describe('setDrawingMode', () => {
    it('should toggle drawing mode', () => {
      useShapesStore.getState().setDrawingMode(true);

      expect(useShapesStore.getState().isDrawingMode).toBe(true);
    });

    it('should deselect shape when entering drawing mode', () => {
      useShapesStore.getState().selectShape('1');
      useShapesStore.getState().setDrawingMode(true);

      expect(useShapesStore.getState().selectedShapeId).toBeNull();
    });
  });

  describe('setDrawingConfig', () => {
    it('should update drawing config', () => {
      useShapesStore.getState().setDrawingConfig({ color: '#ff0000' });

      expect(useShapesStore.getState().drawingConfig.color).toBe('#ff0000');
    });

    it('should merge with existing config', () => {
      useShapesStore.getState().setDrawingConfig({ color: '#ff0000' });

      expect(useShapesStore.getState().drawingConfig).toEqual({
        color: '#ff0000',
        strokeWidth: 3, // Unchanged
      });
    });
  });

  describe('setCanvasInfo', () => {
    it('should update canvas id and name', () => {
      useShapesStore.getState().setCanvasInfo('canvas-123', 'My Drawing');

      expect(useShapesStore.getState().canvasId).toBe('canvas-123');
      expect(useShapesStore.getState().canvasName).toBe('My Drawing');
    });
  });
});
