import { useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { Shape } from '../types/shapes';
import { useShapesStore } from '@store/shapesStore';
import { UpdateShapeCommand } from '../commands/UpdateShapeCommand';
import { commandManager } from '../commands/CommandManager';

type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export const useShapeResizing = (
  shape: Shape,
): { createResizeGesture: (handle: ResizeHandle) => any } => {
  const updateShape = useShapesStore((state) => state.updateShape);

  const savedProps = useSharedValue<Partial<Shape>>({});

  // Define all callbacks first before they are used
  const registerResizeCommand = useCallback(
    (shapeId: string, oldProps: Partial<Shape>, newProps: Partial<Shape>): void => {
      commandManager.execute(new UpdateShapeCommand(shapeId, oldProps, newProps));
    },
    [],
  );

  const resizeRectangle = useCallback(
    (
      rect: Shape & { type: 'rectangle' },
      handle: ResizeHandle,
      deltaX: number,
      deltaY: number,
    ): void => {
      const minSize = 20;
      let newX = rect.x;
      let newY = rect.y;
      let newWidth = rect.width;
      let newHeight = rect.height;

      switch (handle) {
        case 'top-left':
          newX = rect.x + deltaX;
          newY = rect.y + deltaY;
          newWidth = rect.width - deltaX;
          newHeight = rect.height - deltaY;
          break;
        case 'top-right':
          newY = rect.y + deltaY;
          newWidth = rect.width + deltaX;
          newHeight = rect.height - deltaY;
          break;
        case 'bottom-left':
          newX = rect.x + deltaX;
          newWidth = rect.width - deltaX;
          newHeight = rect.height + deltaY;
          break;
        case 'bottom-right':
          newWidth = rect.width + deltaX;
          newHeight = rect.height + deltaY;
          break;
      }

      // Apply minimum size constraints
      if (newWidth < minSize) {
        newWidth = minSize;
        newX = rect.x;
      }
      if (newHeight < minSize) {
        newHeight = minSize;
        newY = rect.y;
      }

      updateShape(rect.id, { x: newX, y: newY, width: newWidth, height: newHeight });
    },
    [updateShape],
  );

  const resizeCircle = useCallback(
    (circle: Shape & { type: 'circle' }, deltaX: number, deltaY: number): void => {
      const minRadius = 10;
      // Calculate distance from center
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      const newRadius = Math.max(minRadius, circle.radius + distance * (deltaX > 0 ? 1 : -1) * 0.5);

      updateShape(circle.id, { radius: newRadius });
    },
    [updateShape],
  );

  const resizeTriangle = useCallback(
    (
      triangle: Shape & { type: 'triangle' },
      handle: ResizeHandle,
      deltaX: number,
      deltaY: number,
    ): void => {
      // Similar to rectangle resizing
      const minSize = 20;
      let newX = triangle.x;
      let newY = triangle.y;
      let newWidth = triangle.width;
      let newHeight = triangle.height;

      switch (handle) {
        case 'bottom-left':
          newX = triangle.x + deltaX;
          newWidth = triangle.width - deltaX;
          newHeight = triangle.height + deltaY;
          break;
        case 'top-right':
          newY = triangle.y + deltaY;
          newWidth = triangle.width + deltaX;
          newHeight = triangle.height - deltaY;
          break;
        case 'bottom-right':
          newWidth = triangle.width + deltaX;
          newHeight = triangle.height + deltaY;
          break;
      }

      if (newWidth < minSize) {
        newWidth = minSize;
        newX = triangle.x;
      }
      if (newHeight < minSize) {
        newHeight = minSize;
        newY = triangle.y;
      }

      updateShape(triangle.id, { x: newX, y: newY, width: newWidth, height: newHeight });
    },
    [updateShape],
  );

  // Now define createResizeGesture after all callbacks are declared
  const createResizeGesture = useCallback(
    (handle: ResizeHandle) => {
      return Gesture.Pan()
        .onStart(() => {
          'worklet';
          // Save initial state for undo command
          if (shape.type === 'rectangle' || shape.type === 'triangle') {
            savedProps.value = { x: shape.x, y: shape.y, width: shape.width, height: shape.height };
          } else if (shape.type === 'circle') {
            savedProps.value = { x: shape.x, y: shape.y, radius: shape.radius };
          }
        })
        .onUpdate((event) => {
          'worklet';
          switch (shape.type) {
            case 'rectangle':
              runOnJS(resizeRectangle)(shape, handle, event.translationX, event.translationY);
              break;
            case 'circle':
              runOnJS(resizeCircle)(shape, event.translationX, event.translationY);
              break;
            case 'triangle':
              runOnJS(resizeTriangle)(shape, handle, event.translationX, event.translationY);
              break;
          }
        })
        .onEnd(() => {
          'worklet';
          // Create undo command
          const oldProps = savedProps.value;
          let newProps: Partial<Shape> = {};

          if (shape.type === 'rectangle' || shape.type === 'triangle') {
            newProps = {
              x: shape.x,
              y: shape.y,
              width: shape.width,
              height: shape.height,
            };
          } else if (shape.type === 'circle') {
            newProps = {
              x: shape.x,
              y: shape.y,
              radius: shape.radius,
            };
          }

          runOnJS(registerResizeCommand)(shape.id, oldProps, newProps);
        });
    },
    [shape, savedProps, resizeRectangle, resizeCircle, resizeTriangle, registerResizeCommand],
  );

  return {
    createResizeGesture,
  };
};
