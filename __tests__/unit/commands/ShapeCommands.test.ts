/**
 * Shape Commands Tests
 */

import { AddShapeCommand } from '../../../src/features/canvas/commands/AddShapeCommand';
import { DeleteShapeCommand } from '../../../src/features/canvas/commands/DeleteShapeCommand';
import { UpdateShapeCommand } from '../../../src/features/canvas/commands/UpdateShapeCommand';
import { useShapesStore } from '../../../src/store/shapesStore';
import { Rectangle } from '../../../src/features/canvas/types/shapes';

// Mock the store
jest.mock('../../../src/store/shapesStore', () => ({
  useShapesStore: {
    getState: jest.fn(),
  },
}));

describe('Shape Commands', () => {
  let mockAddShape: jest.Mock;
  let mockDeleteShape: jest.Mock;
  let mockUpdateShape: jest.Mock;
  let mockSelectShape: jest.Mock;

  const testShape: Rectangle = {
    id: 'test-shape-1',
    type: 'rectangle',
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    color: '#000',
    opacity: 1,
    borderWidth: 2,
    borderColor: '#000',
    zIndex: 0,
  };

  beforeEach(() => {
    mockAddShape = jest.fn();
    mockDeleteShape = jest.fn();
    mockUpdateShape = jest.fn();
    mockSelectShape = jest.fn();

    (useShapesStore.getState as jest.Mock).mockReturnValue({
      addShape: mockAddShape,
      deleteShape: mockDeleteShape,
      updateShape: mockUpdateShape,
      selectShape: mockSelectShape,
      shapes: [],
    });
  });

  describe('AddShapeCommand', () => {
    it('should add shape and select it on execute', () => {
      const command = new AddShapeCommand(testShape);
      command.execute();

      expect(mockAddShape).toHaveBeenCalledWith(testShape);
      expect(mockSelectShape).toHaveBeenCalledWith(testShape.id);
    });

    it('should remove shape and deselect on undo', () => {
      const command = new AddShapeCommand(testShape);
      command.execute();
      command.undo();

      expect(mockDeleteShape).toHaveBeenCalledWith(testShape.id);
      expect(mockSelectShape).toHaveBeenCalledWith(null);
    });

    it('should be reversible', () => {
      const command = new AddShapeCommand(testShape);

      command.execute();
      expect(mockAddShape).toHaveBeenCalledTimes(1);

      command.undo();
      expect(mockDeleteShape).toHaveBeenCalledTimes(1);

      command.execute();
      expect(mockAddShape).toHaveBeenCalledTimes(2);
    });
  });

  describe('DeleteShapeCommand', () => {
    it('should delete shape and deselect on execute', () => {
      const command = new DeleteShapeCommand(testShape);
      command.execute();

      expect(mockDeleteShape).toHaveBeenCalledWith(testShape.id);
      expect(mockSelectShape).toHaveBeenCalledWith(null);
    });

    it('should restore shape and select it on undo', () => {
      const command = new DeleteShapeCommand(testShape);
      command.execute();
      command.undo();

      expect(mockAddShape).toHaveBeenCalledWith(testShape);
      expect(mockSelectShape).toHaveBeenCalledWith(testShape.id);
    });

    it('should be reversible', () => {
      const command = new DeleteShapeCommand(testShape);

      command.execute();
      expect(mockDeleteShape).toHaveBeenCalledTimes(1);

      command.undo();
      expect(mockAddShape).toHaveBeenCalledTimes(1);

      command.execute();
      expect(mockDeleteShape).toHaveBeenCalledTimes(2);
    });
  });

  describe('UpdateShapeCommand', () => {
    const oldProps = { x: 100, y: 100 };
    const newProps = { x: 200, y: 200 };

    it('should update shape with new props on execute', () => {
      const command = new UpdateShapeCommand(testShape.id, oldProps, newProps);
      command.execute();

      expect(mockUpdateShape).toHaveBeenCalledWith(testShape.id, newProps);
    });

    it('should restore old props on undo', () => {
      const command = new UpdateShapeCommand(testShape.id, oldProps, newProps);
      command.execute();
      command.undo();

      expect(mockUpdateShape).toHaveBeenCalledWith(testShape.id, oldProps);
    });

    it('should be reversible', () => {
      const command = new UpdateShapeCommand(testShape.id, oldProps, newProps);

      command.execute();
      expect(mockUpdateShape).toHaveBeenNthCalledWith(1, testShape.id, newProps);

      command.undo();
      expect(mockUpdateShape).toHaveBeenNthCalledWith(2, testShape.id, oldProps);

      command.execute();
      expect(mockUpdateShape).toHaveBeenNthCalledWith(3, testShape.id, newProps);
    });
  });
});
