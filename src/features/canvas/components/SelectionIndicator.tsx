/**
 * Selection Indicator Component
 *
 * Renders a visual indicator around the selected shape
 */

import React from 'react';
import { Circle, Group, Path, Rect } from '@shopify/react-native-skia';
import { Shape } from '../types/shapes';

interface SelectionIndicatorProps {
  shape: Shape;
}

export const SelectionIndicator: React.FC<SelectionIndicatorProps> = ({ shape }) => {
  const selectionColor = '#007AFF';
  const strokeWidth = 2;

  switch (shape.type) {
    case 'rectangle':
      return (
        <Group>
          <Rect
            x={shape.x - strokeWidth}
            y={shape.y - strokeWidth}
            width={shape.width + strokeWidth * 2}
            height={shape.height + strokeWidth * 2}
            color={selectionColor}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          {/* Corner handles */}
          <Circle cx={shape.x} cy={shape.y} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.width} cy={shape.y} r={4} color={selectionColor} />
          <Circle cx={shape.x} cy={shape.y + shape.height} r={4} color={selectionColor} />
          <Circle
            cx={shape.x + shape.width}
            cy={shape.y + shape.height}
            r={4}
            color={selectionColor}
          />
        </Group>
      );

    case 'circle':
      return (
        <Group>
          <Circle
            cx={shape.x}
            cy={shape.y}
            r={shape.radius + strokeWidth}
            color={selectionColor}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          {/* Control points */}
          <Circle cx={shape.x} cy={shape.y - shape.radius} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.radius} cy={shape.y} r={4} color={selectionColor} />
          <Circle cx={shape.x} cy={shape.y + shape.radius} r={4} color={selectionColor} />
          <Circle cx={shape.x - shape.radius} cy={shape.y} r={4} color={selectionColor} />
        </Group>
      );

    case 'triangle':
      const triPath = `M ${shape.x} ${shape.y + shape.height} L ${shape.x + shape.width / 2} ${
        shape.y
      } L ${shape.x + shape.width} ${shape.y + shape.height} Z`;
      return (
        <Group>
          <Path
            path={triPath}
            color={selectionColor}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeJoin="round"
            strokeCap="round"
          />
          {/* Corner handles */}
          <Circle cx={shape.x} cy={shape.y + shape.height} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.width / 2} cy={shape.y} r={4} color={selectionColor} />
          <Circle
            cx={shape.x + shape.width}
            cy={shape.y + shape.height}
            r={4}
            color={selectionColor}
          />
        </Group>
      );

    case 'oval':
      return (
        <Group>
          <Rect
            x={shape.x - strokeWidth}
            y={shape.y - strokeWidth}
            width={shape.rx * 2 + strokeWidth * 2}
            height={shape.ry * 2 + strokeWidth * 2}
            color={selectionColor}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          {/* Corner handles */}
          <Circle cx={shape.x} cy={shape.y} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.rx * 2} cy={shape.y} r={4} color={selectionColor} />
          <Circle cx={shape.x} cy={shape.y + shape.ry * 2} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.rx * 2} cy={shape.y + shape.ry * 2} r={4} color={selectionColor} />
        </Group>
      );

    case 'star':
      return (
        <Group>
          <Rect
            x={shape.x - shape.outerRadius - strokeWidth}
            y={shape.y - shape.outerRadius - strokeWidth}
            width={shape.outerRadius * 2 + strokeWidth * 2}
            height={shape.outerRadius * 2 + strokeWidth * 2}
            color={selectionColor}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          {/* Corner handles */}
          <Circle cx={shape.x - shape.outerRadius} cy={shape.y - shape.outerRadius} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.outerRadius} cy={shape.y - shape.outerRadius} r={4} color={selectionColor} />
          <Circle cx={shape.x - shape.outerRadius} cy={shape.y + shape.outerRadius} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.outerRadius} cy={shape.y + shape.outerRadius} r={4} color={selectionColor} />
        </Group>
      );

    case 'hexagon':
      return (
        <Group>
          <Rect
            x={shape.x - shape.size - strokeWidth}
            y={shape.y - shape.size - strokeWidth}
            width={shape.size * 2 + strokeWidth * 2}
            height={shape.size * 2 + strokeWidth * 2}
            color={selectionColor}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          {/* Corner handles */}
          <Circle cx={shape.x - shape.size} cy={shape.y - shape.size} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.size} cy={shape.y - shape.size} r={4} color={selectionColor} />
          <Circle cx={shape.x - shape.size} cy={shape.y + shape.size} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.size} cy={shape.y + shape.size} r={4} color={selectionColor} />
        </Group>
      );

    case 'diamond':
      return (
        <Group>
          <Rect
            x={shape.x - shape.width / 2 - strokeWidth}
            y={shape.y - shape.height / 2 - strokeWidth}
            width={shape.width + strokeWidth * 2}
            height={shape.height + strokeWidth * 2}
            color={selectionColor}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          {/* Corner handles */}
          <Circle cx={shape.x - shape.width / 2} cy={shape.y - shape.height / 2} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.width / 2} cy={shape.y - shape.height / 2} r={4} color={selectionColor} />
          <Circle cx={shape.x - shape.width / 2} cy={shape.y + shape.height / 2} r={4} color={selectionColor} />
          <Circle cx={shape.x + shape.width / 2} cy={shape.y + shape.height / 2} r={4} color={selectionColor} />
        </Group>
      );

    case 'pentagon':
    case 'octagon':
    case 'heptagon':
      const size = shape.size;
      return (
        <Group>
          <Rect
            x={shape.x - size - strokeWidth}
            y={shape.y - size - strokeWidth}
            width={size * 2 + strokeWidth * 2}
            height={size * 2 + strokeWidth * 2}
            color={selectionColor}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          {/* Corner handles */}
          <Circle cx={shape.x - size} cy={shape.y - size} r={4} color={selectionColor} />
          <Circle cx={shape.x + size} cy={shape.y - size} r={4} color={selectionColor} />
          <Circle cx={shape.x - size} cy={shape.y + size} r={4} color={selectionColor} />
          <Circle cx={shape.x + size} cy={shape.y + size} r={4} color={selectionColor} />
        </Group>
      );

    case 'heart':
    case 'arrow':
      const sW = (shape as any).width;
      const sH = (shape as any).height;
      const sX = shape.type === 'heart' ? shape.x - sW * 0.6 : shape.x - sW / 2;
      const sY = shape.type === 'heart' ? shape.y : (shape.type === 'arrow' && (shape.direction === 'up' || shape.direction === 'down') ? shape.y : shape.y - sH / 2);
      
      const bX = shape.type === 'arrow' && (shape.direction === 'left' || shape.direction === 'right') ? shape.x : sX;
      const bW = sW;
      
      return (
        <Group>
          <Rect
            x={bX - strokeWidth}
            y={sY - strokeWidth}
            width={bW + strokeWidth * 2}
            height={sH + strokeWidth * 2}
            color={selectionColor}
            style="stroke"
            strokeWidth={strokeWidth}
          />
          {/* Corner handles */}
          <Circle cx={bX} cy={sY} r={4} color={selectionColor} />
          <Circle cx={bX + bW} cy={sY} r={4} color={selectionColor} />
          <Circle cx={bX} cy={sY + sH} r={4} color={selectionColor} />
          <Circle cx={bX + bW} cy={sY + sH} r={4} color={selectionColor} />
        </Group>
      );

    case 'path':
      if (shape.points.length === 0) return null;

      // Find bounding box for the path
      const minX = Math.min(...shape.points.map((p) => p.x));
      const maxX = Math.max(...shape.points.map((p) => p.x));
      const minY = Math.min(...shape.points.map((p) => p.y));
      const maxY = Math.max(...shape.points.map((p) => p.y));

      return (
        <Group>
          <Rect
            x={minX - strokeWidth}
            y={minY - strokeWidth}
            width={maxX - minX + strokeWidth * 2}
            height={maxY - minY + strokeWidth * 2}
            color={selectionColor}
            style="stroke"
            strokeWidth={strokeWidth}
          />
        </Group>
      );

    default:
      return null;
  }
};
