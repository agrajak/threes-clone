export interface ThreeEvent {
  type: string;
  handler: Function;
}

export type Point = [number, number];

export interface Cell {
  number: number;
  score: number;
}

export const LEFT = [0, -1] as const;
export const RIGHT = [0, 1] as const;
export const UP = [-1, 0] as const;
export const DOWN = [1, 0] as const;

export type Direction = typeof LEFT | typeof RIGHT | typeof UP | typeof DOWN;
