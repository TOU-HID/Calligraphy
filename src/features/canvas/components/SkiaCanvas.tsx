import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { Canvas, Path } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useGestures } from '../hooks/useGestures';
import { useFreeHandDrawing } from '../hooks/useFreeHandDrawing';
import { useShapesStore } from '@store/shapesStore';
import { ShapeRenderer } from './ShapeRenderer';
import { SelectionIndicator } from './SelectionIndicator';
import { colors, darkColors } from '@theme/colors';

export const SkiaCanvas = (): React.JSX.Element => {
  const shapes = useShapesStore((state) => state.shapes);
  const selectedShapeId = useShapesStore((state) => state.selectedShapeId);
  const drawingConfig = useShapesStore((state) => state.drawingConfig);
  const { gesture } = useGestures();
  const { drawingGesture, currentPathData } = useFreeHandDrawing();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? darkColors : colors;

  // Find the selected shape
  const selectedShape = selectedShapeId
    ? shapes.find((shape) => shape.id === selectedShapeId)
    : null;

  const composedGesture = Gesture.Race(drawingGesture, gesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <View
        style={[styles.container, { backgroundColor: themeColors.canvasBackground }]}
      >
        <Canvas style={styles.canvas}>
          {shapes.map((shape) => (
            <ShapeRenderer key={shape.id} shape={shape} />
          ))}
          {selectedShape && <SelectionIndicator shape={selectedShape} />}
          <Path
            path={currentPathData}
            color={drawingConfig.color}
            style="stroke"
            strokeWidth={drawingConfig.strokeWidth}
            strokeCap="round"
            strokeJoin="round"
          />
        </Canvas>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});
