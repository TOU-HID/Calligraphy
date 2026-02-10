import React from 'react';
import { Circle, Group, Path, Rect } from '@shopify/react-native-skia';
import { Shape } from '../types/shapes';

interface ShapeRendererProps {
  shape: Shape;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({ shape }) => {
  switch (shape.type) {
    case 'rectangle':
      return (
        <Group>
          {/* Fill */}
          <Rect
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            color={shape.color}
            opacity={shape.opacity}
            style="fill"
          />
          {/* Border */}
          {shape.borderWidth > 0 && (
            <Rect
              x={shape.x + shape.borderWidth / 2}
              y={shape.y + shape.borderWidth / 2}
              width={shape.width - shape.borderWidth}
              height={shape.height - shape.borderWidth}
              color={shape.borderColor}
              opacity={shape.opacity}
              style="stroke"
              strokeWidth={shape.borderWidth}
            />
          )}
        </Group>
      );

    case 'circle':
      return (
        <Group>
          <Circle
            cx={shape.x}
            cy={shape.y}
            r={shape.radius}
            color={shape.color}
            opacity={shape.opacity}
            style="fill"
          />
          {shape.borderWidth > 0 && (
            <Circle
              cx={shape.x}
              cy={shape.y}
              r={shape.radius - shape.borderWidth / 2}
              color={shape.borderColor}
              opacity={shape.opacity}
              style="stroke"
              strokeWidth={shape.borderWidth}
            />
          )}
        </Group>
      );

    case 'triangle':
      const triPath = `M ${shape.x} ${shape.y + shape.height} L ${shape.x + shape.width / 2} ${shape.y} L ${shape.x + shape.width} ${shape.y + shape.height} Z`;
      return (
        <Group>
          <Path
            path={triPath}
            color={shape.color}
            opacity={shape.opacity}
            style="fill"
          />
          {shape.borderWidth > 0 && (
            <Path
              path={triPath}
              color={shape.borderColor}
              opacity={shape.opacity}
              style="stroke"
              strokeWidth={shape.borderWidth}
              strokeJoin="round"
              strokeCap="round"
            />
          )}
        </Group>
      );

    case 'path':
      if (shape.points.length === 0) return null;
      
      const pathData = shape.points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

      return (
        <Path
          path={pathData}
          color={shape.color}
          opacity={shape.opacity}
          style="stroke"
          strokeWidth={shape.borderWidth}
          strokeCap="round"
          strokeJoin="round"
        />
      );

    default:
      return null;
  }
};
