import { Command } from './CommandManager';
import { useShapesStore } from '@store/shapesStore';
import { Shape } from '../types/shapes';

export class DeleteShapeCommand implements Command {
  private shape: Shape;

  constructor(shape: Shape) {
    this.shape = shape;
  }

  execute() {
    useShapesStore.getState().deleteShape(this.shape.id);
    useShapesStore.getState().selectShape(null);
  }

  undo() {
    useShapesStore.getState().addShape(this.shape);
    useShapesStore.getState().selectShape(this.shape.id);
  }
}
