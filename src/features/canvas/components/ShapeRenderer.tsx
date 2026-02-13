import React from 'react';
import { Circle, Group, Oval, Path, Rect } from '@shopify/react-native-skia';
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

    case 'oval':
      return (
        <Group>
          <Oval
            x={shape.x}
            y={shape.y}
            width={shape.rx * 2}
            height={shape.ry * 2}
            color={shape.color}
            opacity={shape.opacity}
            style="fill"
          />
          {shape.borderWidth > 0 && (
            <Oval
              x={shape.x + shape.borderWidth / 2}
              y={shape.y + shape.borderWidth / 2}
              width={shape.rx * 2 - shape.borderWidth}
              height={shape.ry * 2 - shape.borderWidth}
              color={shape.borderColor}
              opacity={shape.opacity}
              style="stroke"
              strokeWidth={shape.borderWidth}
            />
          )}
        </Group>
      );

    case 'star':
      const outerRadius = shape.outerRadius;
      const innerRadius = shape.innerRadius;
      const points = shape.points;
      let starPath = "";
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const x = shape.x + radius * Math.cos(angle);
        const y = shape.y + radius * Math.sin(angle);
        starPath += `${i === 0 ? "M" : "L"} ${x} ${y} `;
      }
      starPath += "Z";
      return (
        <Group>
          <Path path={starPath} color={shape.color} opacity={shape.opacity} style="fill" />
          {shape.borderWidth > 0 && (
            <Path
              path={starPath}
              color={shape.borderColor}
              opacity={shape.opacity}
              style="stroke"
              strokeWidth={shape.borderWidth}
              strokeJoin="round"
            />
          )}
        </Group>
      );

    case 'hexagon':
      const size = shape.size;
      let hexPath = "";
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = shape.x + size * Math.cos(angle);
        const y = shape.y + size * Math.sin(angle);
        hexPath += `${i === 0 ? "M" : "L"} ${x} ${y} `;
      }
      hexPath += "Z";
      return (
        <Group>
          <Path path={hexPath} color={shape.color} opacity={shape.opacity} style="fill" />
          {shape.borderWidth > 0 && (
            <Path
              path={hexPath}
              color={shape.borderColor}
              opacity={shape.opacity}
              style="stroke"
              strokeWidth={shape.borderWidth}
              strokeJoin="round"
            />
          )}
        </Group>
      );

    case 'diamond':
      const dWidth = shape.width;
      const dHeight = shape.height;
      const diamondPath = `M ${shape.x} ${shape.y - dHeight / 2} L ${shape.x + dWidth / 2} ${shape.y} L ${shape.x} ${shape.y + dHeight / 2} L ${shape.x - dWidth / 2} ${shape.y} Z`;
      return (
        <Group>
          <Path path={diamondPath} color={shape.color} opacity={shape.opacity} style="fill" />
          {shape.borderWidth > 0 && (
            <Path
              path={diamondPath}
              color={shape.borderColor}
              opacity={shape.opacity}
              style="stroke"
              strokeWidth={shape.borderWidth}
              strokeJoin="round"
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

    case 'pentagon':
    case 'octagon':
    case 'heptagon':
      const sides = shape.type === 'pentagon' ? 5 : shape.type === 'octagon' ? 8 : 7;
      let polyPath = "";
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
        const x = shape.x + shape.size * Math.cos(angle);
        const y = shape.y + shape.size * Math.sin(angle);
        polyPath += `${i === 0 ? "M" : "L"} ${x} ${y} `;
      }
      polyPath += "Z";
      return (
        <Group>
          <Path path={polyPath} color={shape.color} opacity={shape.opacity} style="fill" />
          {shape.borderWidth > 0 && (
            <Path
              path={polyPath}
              color={shape.borderColor}
              opacity={shape.opacity}
              style="stroke"
              strokeWidth={shape.borderWidth}
              strokeJoin="round"
            />
          )}
        </Group>
      );

    case 'heart':
      // Simplified Heart path using Bezier curves
      const hX = shape.x;
      const hY = shape.y;
      const hW = shape.width;
      const hH = shape.height;
      const heartPath = `
        M ${hX} ${hY + hH * 0.3}
        C ${hX} ${hY} ${hX - hW * 0.6} ${hY} ${hX - hW * 0.6} ${hY + hH * 0.3}
        C ${hX - hW * 0.6} ${hY + hH * 0.6} ${hX} ${hY + hH * 0.9} ${hX} ${hY + hH}
        C ${hX} ${hY + hH * 0.9} ${hX + hW * 0.6} ${hY + hH * 0.6} ${hX + hW * 0.6} ${hY + hH * 0.3}
        C ${hX + hW * 0.6} ${hY} ${hX} ${hY} ${hX} ${hY + hH * 0.3}
      `;
      return (
        <Group>
          <Path path={heartPath} color={shape.color} opacity={shape.opacity} style="fill" />
          {shape.borderWidth > 0 && (
            <Path path={heartPath} color={shape.borderColor} opacity={shape.opacity} style="stroke" strokeWidth={shape.borderWidth} />
          )}
        </Group>
      );

    case 'arrow':
      const aX = shape.x;
      const aY = shape.y;
      const aW = shape.width;
      const aH = shape.height;
      const headSize = aH * 0.4;
      const shaftWidth = aW * 0.4;
      
      let arrowPath = "";
      if (shape.direction === 'up' || shape.direction === 'down') {
        const isUp = shape.direction === 'up';
        const startY = isUp ? aY : aY + aH;
        const endY = isUp ? aY + aH : aY;
        const headY = isUp ? aY + headSize : aY + aH - headSize;
        
        arrowPath = `
          M ${aX} ${startY}
          L ${aX - aW / 2} ${headY}
          L ${aX - shaftWidth / 2} ${headY}
          L ${aX - shaftWidth / 2} ${endY}
          L ${aX + shaftWidth / 2} ${endY}
          L ${aX + shaftWidth / 2} ${headY}
          L ${aX + aW / 2} ${headY}
          Z
        `;
      } else {
        const isLeft = shape.direction === 'left';
        const startX = isLeft ? aX : aX + aW;
        const endX = isLeft ? aX + aW : aX;
        const headX = isLeft ? aX + headSize : aX + aW - headSize;
        
        arrowPath = `
          M ${startX} ${aY}
          L ${headX} ${aY - aH / 2}
          L ${headX} ${aY - shaftWidth / 2}
          L ${endX} ${aY - shaftWidth / 2}
          L ${endX} ${aY + shaftWidth / 2}
          L ${headX} ${aY + shaftWidth / 2}
          L ${headX} ${aY + aH / 2}
          Z
        `;
      }
      
      return (
        <Group>
          <Path path={arrowPath} color={shape.color} opacity={shape.opacity} style="fill" />
          {shape.borderWidth > 0 && (
            <Path path={arrowPath} color={shape.borderColor} opacity={shape.opacity} style="stroke" strokeWidth={shape.borderWidth} />
          )}
        </Group>
      );

    default:
      return null;
  }
};
