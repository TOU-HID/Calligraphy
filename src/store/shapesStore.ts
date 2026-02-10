import { create } from 'zustand';
import { Shape } from '@features/canvas/types/shapes';

interface ShapesState {
  shapes: Shape[];
  selectedShapeId: string | null;
  canvasId: string;
  canvasName: string;
  isDrawingMode: boolean;
  drawingConfig: {
    color: string;
    strokeWidth: number;
  };

  // Actions
  addShape: (shape: Shape) => void;
  updateShape: (id: string, update: Partial<Shape> | ((prev: Shape) => Partial<Shape>)) => void;
  deleteShape: (id: string) => void;
  clearAll: () => void;
  setShapes: (shapes: Shape[]) => void;
  selectShape: (id: string | null) => void;
  setCanvasInfo: (id: string, name: string) => void;
  setDrawingMode: (isDrawing: boolean) => void;
  setDrawingConfig: (config: Partial<ShapesState['drawingConfig']>) => void;
}

export const useShapesStore = create<ShapesState>((set) => ({
  shapes: [],
  selectedShapeId: null,
  canvasId: 'default-canvas',
  canvasName: 'Untitled Drawing',
  isDrawingMode: false,
  drawingConfig: {
    color: '#000000',
    strokeWidth: 3,
  },

  addShape: (shape) =>
    set((state) => ({
      shapes: [...state.shapes, shape],
    })),

  updateShape: (id, update) =>
    set((state) => ({
      shapes: state.shapes.map((shape) => {
        if (shape.id !== id) return shape;

        const newValues = typeof update === 'function' ? update(shape) : update;

        // Ensure type safety when merging
        return { ...shape, ...newValues } as Shape;
      }),
    })),

  deleteShape: (id) =>
    set((state) => ({
      shapes: state.shapes.filter((s) => s.id !== id),
      selectedShapeId: state.selectedShapeId === id ? null : state.selectedShapeId,
    })),

  clearAll: () => set({ shapes: [], selectedShapeId: null }),

  setShapes: (shapes) => set({ shapes }),

  selectShape: (id) => set({ selectedShapeId: id }),

  setCanvasInfo: (id, name) => set({ canvasId: id, canvasName: name }),

  setDrawingMode: (isDrawing) => set({ isDrawingMode: isDrawing, selectedShapeId: null }),

  setDrawingConfig: (config) =>
    set((state) => ({
      drawingConfig: { ...state.drawingConfig, ...config },
    })),
}));
