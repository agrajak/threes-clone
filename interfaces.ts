export interface ThreeEvent {
  type: string;
  handler: Function;
}

export type Point = [number, number];

export interface Cell {
  number: number;
  score: number;
}

export type LEFT = [-1, 0];
export type RIGHT = [1, 0];
export type TOP = [0, -1];
export type DOWN = [0, 1];
export type DIRECTION = LEFT | RIGHT | TOP | DOWN;
