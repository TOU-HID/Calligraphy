import { Command } from './CommandManager';
import { useShapesStore } from '@store/shapesStore';
import { Shape } from '../types/shapes';

export class ClearAllCommand implements Command {
  private previousShapes: Shape[];

  constructor() {
    this.previousShapes = useShapesStore.getState().shapes;
  }

  execute(): void {
    useShapesStore.getState().clearAll();
  }

  undo(): void {
    useShapesStore.getState().setShapes(this.previousShapes);
  }
}
