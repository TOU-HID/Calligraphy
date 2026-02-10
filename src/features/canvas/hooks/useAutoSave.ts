import { useEffect, useRef } from 'react';
import { useShapesStore } from '@store/shapesStore';
import { CanvasData, StorageService } from '@/core/storage/StorageService';
import { Shape } from '@features/canvas/types/shapes';

const AUTOSAVE_DELAY = 1000; // 1 second debounce
const DEFAULT_CANVAS_ID = 'default-canvas';

export const useAutoSave = (): void => {
  const shapes = useShapesStore((state) => state.shapes);
  const canvasId = useShapesStore((state) => state.canvasId);
  const canvasName = useShapesStore((state) => state.canvasName);
  const setShapes = useShapesStore((state) => state.setShapes);
  const setCanvasInfo = useShapesStore((state) => state.setCanvasInfo);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadedRef = useRef(false);

  // Load on mount
  useEffect(() => {
    const loadCanvas = (): void => {
      const savedCanvas = StorageService.loadCanvas(DEFAULT_CANVAS_ID);
      if (savedCanvas) {
        setShapes(savedCanvas.shapes as Shape[]);
        setCanvasInfo(savedCanvas.id, savedCanvas.name);
      } else {
        // Initialize new canvas if needing specific setup
        setCanvasInfo(DEFAULT_CANVAS_ID, 'Untitled Drawing');
      }
      isLoadedRef.current = true;
    };

    loadCanvas();
  }, [setShapes, setCanvasInfo]);

  // Auto-save on change
  useEffect(() => {
    if (!isLoadedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const canvasData: CanvasData = {
        id: canvasId,
        name: canvasName,
        shapes,
        viewport: { x: 0, y: 0, scale: 1 }, // Placeholder until viewport is in store
        createdAt: Date.now(), // ideally should be preserved
        updatedAt: Date.now(),
      };

      StorageService.saveCanvas(canvasData);

      // Also update metadata list for the gallery (if we had one)
      // StorageService.saveCanvasList([...]);
    }, AUTOSAVE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shapes, canvasId, canvasName]);
};
