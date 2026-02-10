import React from 'react';
import { useAutoSave } from '../hooks/useAutoSave';

export const AutoSaveManager = (): React.JSX.Element | null => {
  useAutoSave();
  return null;
};
