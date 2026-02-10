import { useState, useEffect } from 'react';
import { commandManager } from '../commands/CommandManager';

export const useUndoRedo = () => {
  const [canUndo, setCanUndo] = useState(commandManager.canUndo);
  const [canRedo, setCanRedo] = useState(commandManager.canRedo);

  useEffect(() => {
    const updateState = () => {
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
