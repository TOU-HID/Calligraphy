import React from 'react';
import Svg, { Circle, Ellipse, Path, Polygon, Rect } from 'react-native-svg';

export type IconShapeType =
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'oval'
  | 'star'
  | 'hexagon'
  | 'diamond'
  | 'pentagon'
  | 'octagon'
  | 'heptagon'
  | 'heart'
  | 'arrow';

interface ShapeIconProps {
  type: IconShapeType;
  color: string;
  size?: number;
}

export const ShapeIcon: React.FC<ShapeIconProps> = ({ type, color, size = 20 }) => {
  const renderIcon = (): React.ReactNode => {
    switch (type) {
      case 'rectangle':
        return <Rect x="2" y="4" width="16" height="12" fill={color} rx="1" />;

      case 'circle':
        return <Circle cx="10" cy="10" r="8" fill={color} />;

      case 'triangle':
        return <Polygon points="10,2 2,18 18,18" fill={color} />;

      case 'oval':
        return <Ellipse cx="10" cy="10" rx="9" ry="6" fill={color} />;

      case 'star': {
        const points = [];
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? 9 : 4.5;
          const a = (Math.PI / 5) * i - Math.PI / 2;
          points.push(`${10 + r * Math.cos(a)},${10 + r * Math.sin(a)}`);
        }
        return <Polygon points={points.join(' ')} fill={color} />;
      }

      case 'hexagon': {
        const points = [];
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 2;
          points.push(`${10 + 9 * Math.cos(a)},${10 + 9 * Math.sin(a)}`);
        }
        return <Polygon points={points.join(' ')} fill={color} />;
      }

      case 'pentagon': {
        const points = [];
        for (let i = 0; i < 5; i++) {
          const a = ((Math.PI * 2) / 5) * i - Math.PI / 2;
          points.push(`${10 + 9 * Math.cos(a)},${10 + 9 * Math.sin(a)}`);
        }
        return <Polygon points={points.join(' ')} fill={color} />;
      }

      case 'octagon': {
        const points = [];
        for (let i = 0; i < 8; i++) {
          const a = ((Math.PI * 2) / 8) * i - Math.PI / 2;
          points.push(`${10 + 9 * Math.cos(a)},${10 + 9 * Math.sin(a)}`);
        }
        return <Polygon points={points.join(' ')} fill={color} />;
      }

      case 'heptagon': {
        const points = [];
        for (let i = 0; i < 7; i++) {
          const a = ((Math.PI * 2) / 7) * i - Math.PI / 2;
          points.push(`${10 + 9 * Math.cos(a)},${10 + 9 * Math.sin(a)}`);
        }
        return <Polygon points={points.join(' ')} fill={color} />;
      }

      case 'diamond':
        return <Polygon points="10,2 18,10 10,18 2,10" fill={color} />;

      case 'heart': {
        return (
          <Path
            d="M 10 18 C 10 18 2 12 2 7 C 2 3 6 2 10 6 C 14 2 18 3 18 7 C 18 12 10 18 10 18"
            fill={color}
          />
        );
      }

      case 'arrow':
        return <Polygon points="10,2 18,10 14,10 14,18 6,18 6,10 2,10" fill={color} />;

      default:
        return null;
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      {renderIcon()}
    </Svg>
  );
};
