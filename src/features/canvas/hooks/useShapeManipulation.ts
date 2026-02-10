import { useCallback } from 'react';
import { commandManager } from '../commands/CommandManager';
import { AddShapeCommand } from '../commands/AddShapeCommand';
import { DeleteShapeCommand } from '../commands/DeleteShapeCommand';
import { useShapesStore } from '@store/shapesStore';
import { v4 as uuid } from 'uuid';
import { Shape } from '../types/shapes';

export const useShapeManipulation = () => {
  const selectShape = useShapesStore((state) => state.selectShape);
  const updateShape = useShapesStore((state) => state.updateShape);

  const createRectangle = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'rectangle',
      x,
      y,
      width: 100,
      height: 100,
      color: '#3498db',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#2c3e50',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createCircle = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'circle',
      x,
      y,
      radius: 50,
      color: '#e74c3c',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#c0392b',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createTriangle = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'triangle',
      x,
      y,
      width: 100,
      height: 100,
      color: '#2ecc71',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#27ae60',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const moveShape = useCallback((id: string, deltaX: number, deltaY: number): void => {
    updateShape(id, (shape) => ({
      ...shape,
      x: shape.x + deltaX,
      y: shape.y + deltaY,
    }));
  }, [updateShape]);

  const resizeShape = useCallback((id: string, newProps: Partial<Shape>): void => {
    updateShape(id, newProps);
  }, [updateShape]);

  const deleteShape = useCallback((id: string): void => {
    const shape = useShapesStore.getState().shapes.find(s => s.id === id);
    if (shape) {
      commandManager.execute(new DeleteShapeCommand(shape));
    }
  }, []);

  return {
    createRectangle,
    createCircle,
    createTriangle,
    moveShape,
    resizeShape,
    deleteShape,
    selectShape,
  };
};
