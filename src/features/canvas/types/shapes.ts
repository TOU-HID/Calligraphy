export interface BaseShape {
  id: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
  borderWidth: number;
  borderColor: string;
  zIndex: number;
}

export interface Rectangle extends BaseShape {
  type: 'rectangle';
  width: number;
  height: number;
}

export interface Circle extends BaseShape {
  type: 'circle';
  radius: number;
}

export interface Triangle extends BaseShape {
  type: 'triangle';
  width: number;
  height: number;
}

export interface Oval extends BaseShape {
  type: 'oval';
  rx: number;
  ry: number;
}

export interface Star extends BaseShape {
  type: 'star';
  points: number;
  innerRadius: number;
  outerRadius: number;
}

export interface Hexagon extends BaseShape {
  type: 'hexagon';
  size: number;
}

export interface Diamond extends BaseShape {
  type: 'diamond';
  width: number;
  height: number;
}

export interface Pentagon extends BaseShape {
  type: 'pentagon';
  size: number;
}

export interface Octagon extends BaseShape {
  type: 'octagon';
  size: number;
}

export interface Heptagon extends BaseShape {
  type: 'heptagon';
  size: number;
}

export interface Heart extends BaseShape {
  type: 'heart';
  width: number;
  height: number;
}

export interface Arrow extends BaseShape {
  type: 'arrow';
  width: number;
  height: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface Point {
  x: number;
  y: number;
}

export interface FreeHandPath extends BaseShape {
  type: 'path';
  points: Point[];
}

export type Shape = 
  | Rectangle 
  | Circle 
  | Triangle 
  | Oval 
  | Star 
  | Hexagon 
  | Diamond 
  | Pentagon 
  | Octagon 
  | Heptagon 
  | Heart 
  | Arrow 
  | FreeHandPath;

export type ShapeType = Shape['type'];
