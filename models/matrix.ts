import { Cell, Direction, Point } from "../interfaces";
import Model from "./index";
export class Matrix extends Model {
  m: Cell[];
  constructor() {
    super();
    this.m = Array.from({ length: 16 }, () => ({ number: 0, score: 0 }));
    this.emit("init");
  }
  add(point: Point) {
    const value = getOneOrTwo();
    this.mutate(point, { number: value });
    this.emit("add");
  }
  move(direction: Direction) {}
  mutate(point: Point, value: Partial<Cell>) {
    const idx = toIdx(point);
    this.m = Object.assign([], this.m, { [idx]: { ...this.m[idx], ...value } });
  }
  lockCellsForDirection(direction: Direction) {}
  unlockCells() {}
  iterate(callback) {
    this.m.forEach((cell, idx) => {
      callback([...toRowCol(idx), idx, cell]);
    });
  }
}

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
