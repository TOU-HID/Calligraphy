import { useCallback, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { v4 as uuidv4 } from 'uuid';
import { useShapesStore } from '@store/shapesStore';
import { FreeHandPath, Point } from '../types/shapes';

export const useFreeHandDrawing = () => {
  // isDrawingMode MUST be a reactive subscription — .enabled() needs it to toggle the gesture
  const isDrawingMode = useShapesStore((state) => state.isDrawingMode);

  // Read config lazily since it's only needed when a stroke finishes
  const getDrawingConfig = () => useShapesStore.getState().drawingConfig;

  // Shared value to hold the points of the current stroke
  const currentPoints = useSharedValue<Point[]>([]);
  const isDrawing = useSharedValue(false);

  const addShapeToStore = useCallback((points: Point[]) => {
    if (points.length < 2) return;

    const drawingConfig = getDrawingConfig();
    const newShape: FreeHandPath = {
      id: uuidv4(),
      type: 'path',
      x: 0,
      y: 0,
      points,
      color: drawingConfig.color,
      opacity: 1,
      borderWidth: drawingConfig.strokeWidth,
      borderColor: drawingConfig.color,
      zIndex: Date.now(),
    };
    useShapesStore.getState().addShape(newShape);
  }, []);

  const gesture = useMemo(() => Gesture.Pan()
    .enabled(isDrawingMode)
    .minDistance(1)
    .onStart((event) => {
      'worklet';
      // event.x/y are already in canvas-local space since the gesture
      // is attached to the Animated.View that has the transform
      const point: Point = { x: event.x, y: event.y };
      currentPoints.value = [point];
      isDrawing.value = true;
    })
    .onUpdate((event) => {
      'worklet';
      const point: Point = { x: event.x, y: event.y };
      currentPoints.value = [...currentPoints.value, point];
    })
    .onEnd(() => {
      'worklet';
      isDrawing.value = false;
      runOnJS(addShapeToStore)(currentPoints.value);
      currentPoints.value = [];
    }), [isDrawingMode, currentPoints, isDrawing, addShapeToStore]);

  // Derived value for rendering the temporary path
  const currentPathData = useDerivedValue(() => {
    if (currentPoints.value.length === 0) return '';
    
    const path = currentPoints.value
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');
      
    return path;
  });

  return {
    drawingGesture: gesture,
    currentPathData,
    isDrawing,
  };
};
