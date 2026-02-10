import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Shape } from '../types/shapes';
import { useShapeResizing } from '../hooks/useShapeResizing';

type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

interface ResizeHandlesOverlayProps {
  shape: Shape;
  transform: {
    translateX: number;
    translateY: number;
    scale: number;
  };
}

interface HandlePosition {
  x: number;
  y: number;
}

// Extract handle component to fix React Hooks rules
const ResizeHandle: React.FC<{
  position: HandlePosition;
  handleType: ResizeHandle;
  createResizeGesture: (handle: ResizeHandle) => any;
}> = ({ position, handleType, createResizeGesture }) => {
  const gesture = createResizeGesture(handleType);
  const handleSize = 20;
  const offset = handleSize / 2;

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width: handleSize,
    height: handleSize,
    left: position.x - offset,
    top: position.y - offset,
    backgroundColor: '#007AFF',
    borderRadius: handleSize / 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle} />
    </GestureDetector>
  );
};

export const ResizeHandlesOverlay: React.FC<ResizeHandlesOverlayProps> = ({ shape, transform }) => {
  const { createResizeGesture } = useShapeResizing(shape);

  const getHandlePositions = (): Record<string, HandlePosition> => {
    const { translateX, translateY, scale } = transform;

    if (shape.type === 'rectangle' || shape.type === 'triangle') {
      const screenX = shape.x * scale + translateX;
      const screenY = shape.y * scale + translateY;
      const width = shape.width * scale;
      const height = shape.height * scale;

      if (shape.type === 'rectangle') {
        return {
          topLeft: { x: screenX, y: screenY },
          topRight: { x: screenX + width, y: screenY },
          bottomLeft: { x: screenX, y: screenY + height },
          bottomRight: { x: screenX + width, y: screenY + height },
        };
      } else {
        // Triangle
        return {
          topCenter: { x: screenX + width / 2, y: screenY },
          bottomLeft: { x: screenX, y: screenY + height },
          bottomRight: { x: screenX + width, y: screenY + height },
        };
      }
    } else if (shape.type === 'circle') {
      const screenX = shape.x * scale + translateX;
      const screenY = shape.y * scale + translateY;
      const radius = shape.radius * scale;

      return {
        top: { x: screenX, y: screenY - radius },
        right: { x: screenX + radius, y: screenY },
        bottom: { x: screenX, y: screenY + radius },
        left: { x: screenX - radius, y: screenY },
      };
    }

    return {};
  };

  const positions = getHandlePositions();

  if (shape.type === 'rectangle') {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <ResizeHandle
          position={positions.topLeft!}
          handleType="top-left"
          createResizeGesture={createResizeGesture}
        />
        <ResizeHandle
          position={positions.topRight!}
          handleType="top-right"
          createResizeGesture={createResizeGesture}
        />
        <ResizeHandle
          position={positions.bottomLeft!}
          handleType="bottom-left"
          createResizeGesture={createResizeGesture}
        />
        <ResizeHandle
          position={positions.bottomRight!}
          handleType="bottom-right"
          createResizeGesture={createResizeGesture}
        />
      </View>
    );
  }

  if (shape.type === 'triangle') {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <ResizeHandle
          position={positions.topCenter!}
          handleType="top-right"
          createResizeGesture={createResizeGesture}
        />
        <ResizeHandle
          position={positions.bottomLeft!}
          handleType="bottom-left"
          createResizeGesture={createResizeGesture}
        />
        <ResizeHandle
          position={positions.bottomRight!}
          handleType="bottom-right"
          createResizeGesture={createResizeGesture}
        />
      </View>
    );
  }

  if (shape.type === 'circle') {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <ResizeHandle
          position={positions.top!}
          handleType="center"
          createResizeGesture={createResizeGesture}
        />
        <ResizeHandle
          position={positions.right!}
          handleType="center"
          createResizeGesture={createResizeGesture}
        />
        <ResizeHandle
          position={positions.bottom!}
          handleType="center"
          createResizeGesture={createResizeGesture}
        />
        <ResizeHandle
          position={positions.left!}
          handleType="center"
          createResizeGesture={createResizeGesture}
        />
      </View>
    );
  }

  return null;
};
