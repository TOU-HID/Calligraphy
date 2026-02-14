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

  const getActiveColor = () => useShapesStore.getState().drawingConfig.color;

  const createRectangle = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'rectangle',
      x,
      y,
      width: 100,
      height: 100,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createCircle = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'circle',
      x,
      y,
      radius: 50,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createTriangle = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'triangle',
      x,
      y,
      width: 100,
      height: 100,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createOval = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'oval',
      x,
      y,
      rx: 60,
      ry: 40,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createStar = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'star',
      x,
      y,
      points: 5,
      innerRadius: 25,
      outerRadius: 50,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createHexagon = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'hexagon',
      x,
      y,
      size: 50,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createDiamond = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'diamond',
      x,
      y,
      width: 80,
      height: 100,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createPentagon = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'pentagon',
      x,
      y,
      size: 50,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createOctagon = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'octagon',
      x,
      y,
      size: 50,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createHeptagon = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'heptagon',
      x,
      y,
      size: 50,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createHeart = useCallback((x: number, y: number): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'heart',
      x,
      y,
      width: 80,
      height: 80,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createArrow = useCallback((x: number, y: number, direction: 'up' | 'down' | 'left' | 'right' = 'right'): void => {
    const color = getActiveColor();
    const shape: Shape = {
      id: uuid(),
      type: 'arrow',
      x,
      y,
      width: 100,
      height: 60,
      direction,
      color,
      opacity: 1,
      borderWidth: 2,
      borderColor: color,
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
    createOval,
    createStar,
    createHexagon,
    createDiamond,
    createPentagon,
    createOctagon,
    createHeptagon,
    createHeart,
    createArrow,
    moveShape,
    resizeShape,
    deleteShape,
    selectShape,
  };
};
