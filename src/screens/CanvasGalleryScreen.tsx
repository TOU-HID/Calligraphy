/**
 * Canvas Gallery Screen
 *
 * Main screen showing all canvases
 */

import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { CanvasGallery, useCanvasManagerStore } from '@features/canvasManager';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';

type CanvasGalleryScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CanvasGallery'>;
};

export const CanvasGalleryScreen: React.FC<CanvasGalleryScreenProps> = ({ navigation }) => {
  const loadCanvases = useCanvasManagerStore((state) => state.loadCanvases);

  // Reload canvases when screen comes into focus (e.g., returning from canvas screen)
  useFocusEffect(
    useCallback(() => {
      loadCanvases();
    }, [loadCanvases]),
  );

  const handleCanvasSelect = (canvasId: string): void => {
    navigation.navigate('Canvas', { canvasId });
  };

  return <CanvasGallery onCanvasSelect={handleCanvasSelect} />;
};
