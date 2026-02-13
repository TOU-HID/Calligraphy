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

  const createOval = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'oval',
      x,
      y,
      rx: 60,
      ry: 40,
      color: '#9b59b6',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#8e44ad',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createStar = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'star',
      x,
      y,
      points: 5,
      innerRadius: 25,
      outerRadius: 50,
      color: '#f1c40f',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#f39c12',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createHexagon = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'hexagon',
      x,
      y,
      size: 50,
      color: '#1abc9c',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#16a085',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createDiamond = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'diamond',
      x,
      y,
      width: 80,
      height: 100,
      color: '#e67e22',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#d35400',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createPentagon = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'pentagon',
      x,
      y,
      size: 50,
      color: '#27ae60',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#1e8449',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createOctagon = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'octagon',
      x,
      y,
      size: 50,
      color: '#d35400',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#a04000',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createHeptagon = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'heptagon',
      x,
      y,
      size: 50,
      color: '#7f8c8d',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#34495e',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createHeart = useCallback((x: number, y: number): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'heart',
      x,
      y,
      width: 80,
      height: 80,
      color: '#c0392b',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#922b21',
      zIndex: Date.now(),
    };
    commandManager.execute(new AddShapeCommand(shape));
  }, []);

  const createArrow = useCallback((x: number, y: number, direction: 'up' | 'down' | 'left' | 'right' = 'right'): void => {
    const shape: Shape = {
      id: uuid(),
      type: 'arrow',
      x,
      y,
      width: 100,
      height: 60,
      direction,
      color: '#2980b9',
      opacity: 1,
      borderWidth: 2,
      borderColor: '#1a5276',
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
