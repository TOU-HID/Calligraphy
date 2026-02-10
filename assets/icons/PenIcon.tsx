import React from 'react';
import { Canvas, Group, Path } from '@shopify/react-native-skia';

interface PenIconProps {
  size?: number;
  color?: string;
}

export const PenIcon = ({ size = 24, color = '#000000' }: PenIconProps) => {
  // SVG Path for a pen (Lucide style)
  const path = "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z";

  return (
    <Canvas style={{ width: size, height: size }}>
       <Group transform={[{ scale: size / 24 }]}>
        <Path
          path={path}
          color={color}
          style="stroke"
          strokeWidth={2}
          strokeJoin="round"
          strokeCap="round"
        />
       </Group>
    </Canvas>
  );
};
