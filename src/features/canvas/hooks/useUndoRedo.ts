import { useEffect, useState } from 'react';
import { commandManager } from '../commands/CommandManager';

export const useUndoRedo = (): {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
} => {
  const [canUndo, setCanUndo] = useState(commandManager.canUndo);
  const [canRedo, setCanRedo] = useState(commandManager.canRedo);

  useEffect(() => {
    const updateState = (): void => {
      setCanUndo(commandManager.canUndo);
      setCanRedo(commandManager.canRedo);
    };

    // Initial sync
    updateState();

    const unsubscribe = commandManager.subscribe(updateState);
    return unsubscribe;
  }, []);

  return {
    canUndo,
    canRedo,
    undo: () => commandManager.undo(),
    redo: () => commandManager.redo(),
  };
};
