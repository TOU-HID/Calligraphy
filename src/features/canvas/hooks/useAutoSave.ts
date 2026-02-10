import { useEffect, useRef } from 'react';
import { useShapesStore } from '@store/shapesStore';
import { CanvasData, StorageService } from '@/core/storage/StorageService';
import { CanvasService, ThumbnailService } from '@features/canvasManager';

const AUTOSAVE_DELAY = 1000; // 1 second debounce

export const useAutoSave = (): void => {
  const shapes = useShapesStore((state) => state.shapes);
  const canvasId = useShapesStore((state) => state.canvasId);
  const canvasName = useShapesStore((state) => state.canvasName);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadedRef = useRef(false);
  const createdAtRef = useRef<number>(Date.now());

  // Track initial load
  useEffect(() => {
    const existingCanvas = StorageService.loadCanvas(canvasId);
    if (existingCanvas) {
      createdAtRef.current = existingCanvas.createdAt;
    }
    isLoadedRef.current = true;
  }, [canvasId]);

  // Auto-save on change
  useEffect(() => {
    if (!isLoadedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      const canvasData: CanvasData = {
        id: canvasId,
        name: canvasName,
        shapes,
        viewport: { x: 0, y: 0, scale: 1 },
        createdAt: createdAtRef.current,
        updatedAt: Date.now(),
      };

      StorageService.saveCanvas(canvasData);

      // Update canvas metadata (shape count, updated timestamp)
      CanvasService.updateCanvasShapeCount(canvasId, shapes.length);

      // Generate and save thumbnail
      await ThumbnailService.generateAndSave(canvasId);
    }, AUTOSAVE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shapes, canvasId, canvasName]);
};
