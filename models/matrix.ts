import { Cell, DIRECTION, Point } from "../interfaces";
import Model from "./index";

function getRandomInt(max: number = 1) {
  return Math.floor(Math.random() * max);
}
function getOneOrTwo() {
  return getRandomInt(2) + 1;
}
function getRandomPoint(): Point {
  return [getRandomInt(4), getRandomInt(4)];
}
function toRowCol(idx): Point {
  return [Math.floor(idx / 4), idx % 4];
}
function toIdx([row, col]: Point) {
  return row * 4 + col;
}
export class Matrix extends Model {
  m: Cell[];
  constructor() {
    super();
    this.m = Array.from({ length: 16 }, () => ({ number: 0, score: 0 }));
  }
  add(p: Point) {
    const value = getOneOrTwo();
    this.mutate(p, { number: value });
    this.emit("add");
  }
  move(direction: DIRECTION) {}
  mutate(p: Point, value: Partial<Cell>) {
    const idx = toIdx(p);
    this.m = Object.assign([], this.m, { [idx]: { ...this.m[idx], ...value } });
  }
  iterate(callback) {
    this.m.forEach((cell, idx) => {
      callback([...toRowCol(idx), cell]);
    });
  }
}
