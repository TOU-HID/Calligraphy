import { Command } from './CommandManager';
import { useShapesStore } from '@store/shapesStore';
import { Shape } from '../types/shapes';

export class AddShapeCommand implements Command {
  private shape: Shape;

  constructor(shape: Shape) {
    this.shape = shape;
  }

  execute() {
    useShapesStore.getState().addShape(this.shape);
    useShapesStore.getState().selectShape(this.shape.id);
  }

  undo() {
    useShapesStore.getState().deleteShape(this.shape.id);
    useShapesStore.getState().selectShape(null);
  }
}
