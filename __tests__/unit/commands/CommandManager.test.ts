/**
 * Command Manager Tests
 */

import { Command, CommandManager } from '../../../src/features/canvas/commands/CommandManager';

// Mock command for testing
class MockCommand implements Command {
  public executed = false;
  public undone = false;

  execute(): void {
    this.executed = true;
    this.undone = false;
  }

  undo(): void {
    this.undone = true;
    this.executed = false;
  }
}

describe('CommandManager', () => {
  let commandManager: CommandManager;

  beforeEach(() => {
    commandManager = new CommandManager();
  });

  describe('execute', () => {
    it('should execute a command', () => {
      const command = new MockCommand();
      commandManager.execute(command);

      expect(command.executed).toBe(true);
      expect(commandManager.canUndo).toBe(true);
    });

    it('should clear redo stack when new command is executed', () => {
      const command1 = new MockCommand();
      const command2 = new MockCommand();
      const command3 = new MockCommand();

      commandManager.execute(command1);
      commandManager.execute(command2);
      commandManager.undo(); // command2 in redo stack

      expect(commandManager.canRedo).toBe(true);

      commandManager.execute(command3); // Should clear redo stack

      expect(commandManager.canRedo).toBe(false);
    });
  });

  describe('undo', () => {
    it('should undo the last command', () => {
      const command = new MockCommand();
      commandManager.execute(command);

      commandManager.undo();

      expect(command.undone).toBe(true);
      expect(commandManager.canUndo).toBe(false);
      expect(commandManager.canRedo).toBe(true);
    });

    it('should undo multiple commands in reverse order', () => {
      const command1 = new MockCommand();
      const command2 = new MockCommand();

      commandManager.execute(command1);
      commandManager.execute(command2);

      commandManager.undo();
      expect(command2.undone).toBe(true);
      expect(command1.executed).toBe(true);

      commandManager.undo();
      expect(command1.undone).toBe(true);
    });

    it('should do nothing when undo stack is empty', () => {
      expect(commandManager.canUndo).toBe(false);
      commandManager.undo(); // Should not throw
      expect(commandManager.canUndo).toBe(false);
    });
  });

  describe('redo', () => {
    it('should redo the last undone command', () => {
      const command = new MockCommand();
      commandManager.execute(command);
      commandManager.undo();

      commandManager.redo();

      expect(command.executed).toBe(true);
      expect(commandManager.canRedo).toBe(false);
      expect(commandManager.canUndo).toBe(true);
    });

    it('should redo multiple commands in order', () => {
      const command1 = new MockCommand();
      const command2 = new MockCommand();

      commandManager.execute(command1);
      commandManager.execute(command2);
      commandManager.undo();
      commandManager.undo();

      commandManager.redo();
      expect(command1.executed).toBe(true);
      expect(command2.undone).toBe(true);

      commandManager.redo();
      expect(command2.executed).toBe(true);
    });

    it('should do nothing when redo stack is empty', () => {
      expect(commandManager.canRedo).toBe(false);
      commandManager.redo(); // Should not throw
      expect(commandManager.canRedo).toBe(false);
    });
  });

  describe('canUndo and canRedo', () => {
    it('should return false initially', () => {
      expect(commandManager.canUndo).toBe(false);
      expect(commandManager.canRedo).toBe(false);
    });

    it('should return correct states after operations', () => {
      const command = new MockCommand();

      commandManager.execute(command);
      expect(commandManager.canUndo).toBe(true);
      expect(commandManager.canRedo).toBe(false);

      commandManager.undo();
      expect(commandManager.canUndo).toBe(false);
      expect(commandManager.canRedo).toBe(true);

      commandManager.redo();
      expect(commandManager.canUndo).toBe(true);
      expect(commandManager.canRedo).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('should notify listeners on execute', () => {
      const listener = jest.fn();
      commandManager.subscribe(listener);

      const command = new MockCommand();
      commandManager.execute(command);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should notify listeners on undo', () => {
      const listener = jest.fn();
      const command = new MockCommand();
      commandManager.execute(command);

      commandManager.subscribe(listener);
      commandManager.undo();

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should notify listeners on redo', () => {
      const listener = jest.fn();
      const command = new MockCommand();
      commandManager.execute(command);
      commandManager.undo();

      commandManager.subscribe(listener);
      commandManager.redo();

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function', () => {
      const listener = jest.fn();
      const unsubscribe = commandManager.subscribe(listener);

      const command = new MockCommand();
      commandManager.execute(command);
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      commandManager.execute(new MockCommand());
      expect(listener).toHaveBeenCalledTimes(1); // Not called again
    });
  });

  describe('history size limit', () => {
    it('should limit undo stack size', () => {
      // Create 60 commands (exceeds max of 50)
      for (let i = 0; i < 60; i++) {
        commandManager.execute(new MockCommand());
      }

      // Undo all possible
      let undoCount = 0;
      while (commandManager.canUndo) {
        commandManager.undo();
        undoCount++;
      }

      expect(undoCount).toBe(50); // Max history size
    });
  });
});
