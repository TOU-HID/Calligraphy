import { Command } from './CommandManager';
import { useShapesStore } from '@store/shapesStore';
import { Shape } from '../types/shapes';

export class UpdateShapeCommand implements Command {
  private shapeId: string;
  private oldProps: Partial<Shape>;
  private newProps: Partial<Shape>;

  constructor(shapeId: string, oldProps: Partial<Shape>, newProps: Partial<Shape>) {
    this.shapeId = shapeId;
    this.oldProps = oldProps;
    this.newProps = newProps;
  }

  execute(): void {
    useShapesStore.getState().updateShape(this.shapeId, this.newProps);
  }

  undo(): void {
    useShapesStore.getState().updateShape(this.shapeId, this.oldProps);
  }
}
