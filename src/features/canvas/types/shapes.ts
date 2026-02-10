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

export interface Point {
  x: number;
  y: number;
}

export interface FreeHandPath extends BaseShape {
  type: 'path';
  points: Point[];
}

export type Shape = Rectangle | Circle | Triangle | FreeHandPath;

export type ShapeType = Shape['type'];
